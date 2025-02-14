import { injectable } from "@biorate/inversion";
import { Logger } from "@nestjs/common";
import { User } from "../models";

@injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  public async getUser(userid: number) {
    this.logger.debug(`(getUser) Processing request...`);
    const user = await User.findByPk(userid, {attributes: ["email", "firstname", "lastname"]});
    return user;
  }
}
