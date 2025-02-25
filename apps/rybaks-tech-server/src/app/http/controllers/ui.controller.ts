import { IConfig } from "@biorate/config";
import { FilesInterceptor } from "@nestjs/platform-express";
import { inject, Types } from "@biorate/inversion";
import { ApiOperation } from "@nestjs/swagger";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UIService } from "../../../services";
import { UserDecorator } from "../decorators";
import { JwtGuard } from "../guards";

// const devApiDelay = 500;

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

    // await new Promise((resolve) => setTimeout(resolve, devApiDelay));

    return this.uiService.getUserGames(id);
  }

  @Get("user/:id/screenshots")
  public async getUserScreenshots(@Param("id", new ParseIntPipe()) id: number) {
    this.logger.debug(`(getUserScreenshots) Incoming request. id: ${id}`);

    // await new Promise((resolve) => setTimeout(resolve, devApiDelay));

    return this.uiService.getUserScreenshots(id);
  }

  @Get("user/:userid/game/:gameid/screenshots")
  public async getUserGameScreenshots(
    @Param("userid", new ParseIntPipe()) userid: number,
    @Param("gameid", new ParseIntPipe()) gameid: number,
    @Query("from") from: number,
    @Query("size") size: number,
  ) {
    this.logger.debug(`(getUserGameScreenshots) Incoming request. id: ${userid}, gameid: ${gameid}`);

    // await new Promise((resolve) => setTimeout(resolve, devApiDelay));

    return this.uiService.getUserGameScreenshots(userid, gameid, from, size);
  }

  @Post("user/:userid/game/create")
  public createGame(
    @Param("userid", new ParseIntPipe()) userid: number,
    @UserDecorator("sub") sub: number,
    @Body("gameName") gameName: string,
    @Body("base64icon") base64icon: string,
  ) {
    this.logger.debug(`(createGame) Incoming request. userid: ${userid}, gameName: ${gameName}, base64icon: ${base64icon}`);

    if (userid !== sub) {
      throw new UnauthorizedException();
    }

    return this.uiService.createUserGame(gameName, base64icon, userid);
  }

  @Post("user/:userid/game/:gameid/screenshots/upload")
  @UseInterceptors(FilesInterceptor("files"))
  public uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param("userid", new ParseIntPipe()) userid: number,
    @Param("gameid", new ParseIntPipe()) gameid: number,
    @Query("dateTaken") dateTaken: Date,
    @UserDecorator("sub") sub: number,
    @Body("lastModified") lastModified: string[],
  ) {
    if (userid !== sub) {
      throw new UnauthorizedException();
    }
    if (!files || files.length === 0) {
      throw new BadRequestException("No files were uploaded.");
    }
    this.logger.debug(`(uploadFile) Incoming request. userid: ${userid}, gameid: ${gameid}, files length: ${files.length}, dateTaken: ${dateTaken}`);

    return this.uiService.uploadFiles(files, gameid, userid, lastModified);
  }
}
