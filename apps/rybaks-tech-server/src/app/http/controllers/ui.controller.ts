import { IConfig } from "@biorate/config";
import { FilesInterceptor } from "@nestjs/platform-express";
import { inject, Types } from "@biorate/inversion";
import { ApiOperation } from "@nestjs/swagger";
import { Controller, Get, Logger, Param, ParseIntPipe, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { UIService } from "../../../services";
import { UserDecorator } from "../decorators";
import { JwtGuard } from "../guards";

const devApiDelay = 500;

@Controller("api")
@UseGuards(JwtGuard)
export class UIController {
  private readonly logger: Logger = new Logger(UIController.name);

  @inject(Types.Config) protected config: IConfig;

  @inject(Types.UIService) protected uiService: UIService;

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

    return this.uiService.getUser(sub);
  }

  @Get("user/:id/games")
  public async getUserGames(@Param("id", new ParseIntPipe()) id: number) {
    this.logger.debug(`(getUserGames) Incoming request. id: ${id}`);

    await new Promise((resolve) => setTimeout(resolve, devApiDelay));

    return this.uiService.getUserGames(id);
  }

  @Get("user/:id/screenshots")
  public async getUserScreenshots(@Param("id", new ParseIntPipe()) id: number) {
    this.logger.debug(`(getUserScreenshots) Incoming request. id: ${id}`);

    await new Promise((resolve) => setTimeout(resolve, devApiDelay));

    return this.uiService.getUserScreenshots(id);
  }

  @Get("user/:userid/game/:gameid/screenshots")
  public async getUserGameScreenshots(@Param("userid", new ParseIntPipe()) userid: number, @Param("gameid", new ParseIntPipe()) gameid: number) {
    this.logger.debug(`(getUserGameScreenshots) Incoming request. id: ${userid}, gameid: ${gameid}`);

    await new Promise((resolve) => setTimeout(resolve, devApiDelay));

    return this.uiService.getUserGameScreenshots(userid, gameid);
  }

  @Post("user/:userid/game/:gameid/screenshots/upload")
  @UseInterceptors(FilesInterceptor("files"))
  public uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param("userid", new ParseIntPipe()) userid: number,
    @Param("gameid", new ParseIntPipe()) gameid: number,
  ) {
    this.logger.debug(`(uploadFile) Incoming request. files: ${files.length}`);

    return this.uiService.uploadFiles(files, gameid, userid);
  }
}
