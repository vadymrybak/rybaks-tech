import { inject, injectable, Types } from "@biorate/inversion";
import { Logger } from "@nestjs/common";
import * as sharp from "sharp";
import * as dayjs from "dayjs";
import { S3Helper } from ".";
import { Game, Screenshot, ScreenshotGameUser, User, UserGame } from "../models";
import { ServiceApiSequelizeConnector } from "../connectors/SequelizeConnector";

interface IConvertedImage {
  filename: string;
  base64: string;
}

@injectable()
export class UIService {
  private readonly logger: Logger = new Logger(UIService.name);

  @inject(Types.ServiceApiSequelizeConnector) connector: ServiceApiSequelizeConnector;

  @inject(Types.S3Helper) s3Helper: S3Helper;

  public async getUser(userid: number) {
    this.logger.debug(`(getUser) Processing request. userid: ${userid}`);
    const user = await User.findByPk(userid, { attributes: ["id", "email", "firstname", "lastname"] });
    return user;
  }

  public async getUserGames(userid: number) {
    this.logger.debug(`(getUserGames) Processing request. userid: ${userid}`);
    const user = await User.findByPk(userid, {
      include: [{ model: UserGame, include: [{ model: Game, attributes: ["id", "name", "icon"] }] }],
    });
    return user.games.map((game) => game.game);
  }

  public async getUserScreenshots(userid: number) {
    this.logger.debug(`(getUserScreenshots) Processing request. userid: ${userid}`);
    const screenshots = await Screenshot.findAll({
      include: [{ model: ScreenshotGameUser, where: { userid } }],
    });
    return screenshots.map((s) => ({
      id: s.id,
      base64: s.base64,
      name: s.name,
      description: s.description,
      updatedat: s.updatedat,
      createdat: s.createdat,
    }));
  }

  public async getUserGameScreenshots(userid: number, gameid: number, from: number, size: number) {
    this.logger.debug(`(getUserGameScreenshots) Processing request. userid: ${userid}, gameid: ${gameid}, from: ${from}, size: ${size}`);

    const screenshots = await Screenshot.findAll({
      // attributes: ["name", "createdat"],
      order: [["createdat", "DESC"]],
      offset: from,
      limit: size,
      include: [{ model: ScreenshotGameUser, where: { userid }, include: [{ model: User }, { model: Game, where: { id: gameid } }] }],
    });
    // return screenshots;

    const days: {
      [date: string]: any[];
    } = {};

    for (let index = 0; index < screenshots.length; index++) {
      const currentScreenshot = screenshots[index];
      const sceenshotDate = dayjs(currentScreenshot.createdat).format("DD MMMM, YYYY");
      const screen = {
        id: currentScreenshot.id,
        base64: currentScreenshot.base64,
        name: currentScreenshot.name,
        filename: currentScreenshot.filename,
        description: currentScreenshot.description,
        updatedat: currentScreenshot.updatedat,
        createdat: currentScreenshot.createdat,
      };
      if (days[sceenshotDate]) {
        days[sceenshotDate].push(screen);
      } else {
        days[sceenshotDate] = [screen];
      }
    }

    return {
      screenshots: {
        byDay: days,
      },
      from,
      size,
      total: screenshots.length,
    };
  }

  public async createUserGame(gameName: string, base64icon: string, userid: number) {
    const transaction = await this.connector.connection("rybaksTech").transaction(async () => {
      const gameCreateResult = await Game.create({
        name: gameName,
        icon: base64icon,
      });
      const gameAssignToUserResult = await UserGame.create({
        userid,
        gameid: gameCreateResult.id,
      });
    });

    return transaction;
  }

  public async uploadFiles(files: Express.Multer.File[], gameid: number, userid: number, dates: string[]) {
    this.logger.debug(`(uploadFiles) Processing request. files: ${files.length}, gameid: ${gameid}, userid: ${userid}`);

    const s3UserFolder = `${userid}-screenhots/${gameid}`;
    const b64Images: IConvertedImage[] = [];

    this.logger.debug(`(uploadFiles) Uploading original files to S3 and converting ${files.length} files to base64...`);
    for (let index = 0; index < files.length; index++) {
      let loopImage = files[index];

      const res = await this.s3Helper.uploadScreenshot(s3UserFolder, loopImage);
      this.logger.debug(`(uploadFiles) File ${index + 1}/${files.length}  - ${loopImage.originalname} result: ${res.$metadata.httpStatusCode}`);

      const im = sharp(loopImage.buffer);
      const toPut = (await im.resize(400).toFormat("jpeg").toBuffer()).toString("base64");
      b64Images.push({
        base64: toPut,
        filename: loopImage.originalname,
      });
    }
    this.logger.debug(`(uploadFiles) Done converting ${files.length} files to base64`);
    this.logger.debug(`(uploadFiles) Uploading ${files.length} files to DB...`);

    const transaction = await this.connector.connection("rybaksTech").transaction(async () => {
      const s = await Screenshot.bulkCreate(
        b64Images.map((img, index) => {
          return {
            base64: img.base64,
            createdat: new Date(parseInt(dates[index], 10)),
            filename: img.filename,
            name: `image-${index}`,
            description: `description-${index}`,
          };
        }),
        { logging: false },
      );
      const screenshotIds = s.map((a) => a.id);

      this.logger.debug(`(uploadFiles) Screenshot id-s to be uploaded to db: ${screenshotIds.join(",")}`);

      await ScreenshotGameUser.bulkCreate(
        screenshotIds.map((screenshotid) => ({
          screenshotid,
          userid,
          gameid,
        })),
      );
    });
    return "Done";
  }
}
