import { injectable } from "@biorate/inversion";
import { Logger } from "@nestjs/common";
import { Game, User, UserGame } from "../models";

@injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

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
}
