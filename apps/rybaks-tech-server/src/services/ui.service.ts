import { inject, injectable, Types } from "@biorate/inversion";
import { Logger } from "@nestjs/common";
import * as sharp from "sharp";
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

  public async getUser(userid: number) {
    this.logger.debug(`(getUser) Processing request. userid: ${userid}`);
    const user = await User.findByPk(userid, { attributes: ["id", "email", "firstname", "lastname"] });
    return user;
  }

  public async getUserGames(userid: number) {
    this.logger.debug(`(getUserGames) Processing request. userid: ${userid}`);
    const user = await User.findByPk(userid, {
      include: [{ model: UserGame, include: [{ model: Game, attributes: ["id", "name"] }] }],
    });
    return user.games.map((game) => game.game);
  }

  public async uploadFiles(files: Express.Multer.File[], gameid: number, userid: number) {
    this.logger.debug(`(uploadFiles) Processing request. files: ${files.length}, gameid: ${gameid}, userid: ${userid}`);

    this.logger.debug(`(uploadFiles) Converting ${files.length} files to base64...`);
    const b64Images: IConvertedImage[] = [];
    for (let index = 0; index < files.length; index++) {
      let loopImage = files[index];
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
        b64Images.map((img, index) => ({ base64: img.base64, filename: img.filename, name: `image-${index}`, description: `description-${index}` })),
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

  public async getUserGameScreenshots(userid: number, gameid: number) {
    this.logger.debug(`(getUserGameScreenshots) Processing request. userid: ${userid}, gameid: ${gameid}`);

    const screenshots = await Screenshot.findAll({
      // attributes: ["name"],
      include: [{ model: ScreenshotGameUser, where: { userid }, include: [{ model: User }, { model: Game, where: { id: gameid } }] }],
    });
    // return screenshots;
    return {
      screenshots: screenshots.map((s) => ({
        id: s.id,
        base64: s.base64,
        name: s.name,
        description: s.description,
        updatedat: s.updatedat,
        createdat: s.createdat,
      })),
      total: screenshots.length,
    };
  }
}
