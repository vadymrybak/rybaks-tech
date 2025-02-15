import { IConfig } from "@biorate/config";
import { inject, Types } from "@biorate/inversion";
import { Controller, Get, Logger, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuthService, UserService } from "../../../services";
import { UserDecorator } from "../decorators";
import { JwtGuard } from "../guards";

@Controller("api")
@UseGuards(JwtGuard)
export class UIController {
  private readonly logger: Logger = new Logger(UIController.name);

  @inject(Types.AuthService) protected authService: AuthService;

  @inject(Types.UserService) protected userService: UserService;

  @inject(Types.Config) protected config: IConfig;

  @Get("check-token")
  protected checkToken() {
    this.logger.debug(`(checkToken) Incoming request`);

    return "OK";
  }

  @Get("config")
  @ApiOperation({ summary: "Get client config" })
  protected getConfig() {
    this.logger.debug(`(getConfig) Incoming request`);

    return {
      ENV: this.config.get<string>("ENV", "debug"),
      version: this.config.get<string>("package.version"),
    };
  }

  @Get("user")
  public getUser(@UserDecorator("sub") sub: number) {
    this.logger.debug(`(getUser) Incoming request`);

    return this.userService.getUser(sub);
  }

  @Get("user/:id/games")
  public getUserGames(@Param("id", new ParseIntPipe()) id: number) {
    return this.userService.getUserGames(id);
  }
}
