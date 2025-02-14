import { Body, Controller, HttpCode, HttpStatus, Post, Get, Logger, UseGuards } from "@nestjs/common";
import { UserService } from "../../../services";
import { inject, Types } from "@biorate/inversion";
import { JwtGuard } from "../guards";
import { UserDecorator } from "../decorators";

@Controller("user")
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);
  @inject(Types.UserService) protected userService: UserService;

  @Get()
  @UseGuards(JwtGuard)
  public getUser(@UserDecorator("sub") sub: number) {
    this.logger.debug(`(getUser) Incoming request`);

    return this.userService.getUser(sub);
  }
}
