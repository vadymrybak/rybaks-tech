import { Controller, Get, UseGuards } from "@nestjs/common";
import { inject, Types } from "@biorate/inversion";
import { AuthService } from "../../../services";
import { JwtGuard } from "../guards";
import { UserDecorator } from "../decorators";

@Controller("api")
export class UIController {
  @inject(Types.AuthService) protected authService: AuthService;

  @Get("")
  @UseGuards(JwtGuard)
  public test(@UserDecorator("sub") sub: number) {
    return "good";
  }
}
