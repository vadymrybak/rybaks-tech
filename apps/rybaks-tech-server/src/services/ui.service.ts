import { injectable } from "@biorate/inversion";
import { Logger } from "@nestjs/common";
import * as sharp from "sharp";
import { Game, Screenshot, ScreenshotGameUser, User, UserGame } from "../models";

@injectable()
export class UIService {
  private readonly logger: Logger = new Logger(UIService.name);

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

  public async uploadFiles(files: Express.Multer.File[]) {
    this.logger.debug(`(uploadFiles) Processing request. files: ${files.length}`);

    const b64: string[] = [];
    for (let index = 0; index < files.length; index++) {
      let base64Image = files[index].buffer;
      const im = sharp(base64Image);
      b64.push((await im.resize(400).toBuffer()).toString("base64"));
    }

    return b64;
  }

  public async getUserScreenshots(userid: number) {
    this.logger.debug(`(getUserScreenshots) Processing request. userid: ${userid}`);
    const screenshots = await Screenshot.findAll({
      include: [{ model: ScreenshotGameUser, where: { userid } }],
      // include: [{ model: ScreenshotGameUser, where: { userid }, include: [{ model: User }, { model: Game }] }],
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
}
