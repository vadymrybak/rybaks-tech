import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "../../../services";
import { inject, Types } from "@biorate/inversion";
import { AuthDto } from "../dto";

@Controller("auth")
export class AuthController {
  @inject(Types.AuthService) protected authService: AuthService;

  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  public signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("signin")
  public async signin(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.signin(dto);
    res.status(200).cookie("access_token", token.access_token);
    return { message: "Login successful." };
  }
}
