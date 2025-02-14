import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Res } from "@nestjs/common";
import { inject, Types } from "@biorate/inversion";
import { Response } from "express";
import { AuthService } from "../../../services";
import { AuthDto } from "../dto";

@Controller("auth")
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  @inject(Types.AuthService) protected authService: AuthService;

  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  public signup(@Body() dto: AuthDto) {
    this.logger.debug(`(signup) Incoming request. ${JSON.stringify(dto)}`);

    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("signin")
  public async signin(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    this.logger.debug(`(signin) Incoming request. ${JSON.stringify(dto)}`);

    const token = await this.authService.signin(dto);
    res.status(200).cookie("access_token", token.access_token);
    return { message: "Login successful." };
  }
}
