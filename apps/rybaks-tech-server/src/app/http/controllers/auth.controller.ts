import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../../../services';
import { inject, Types } from '@biorate/inversion';
import { AuthDto } from '../dto';

@Controller('auth')
export class AuthController {
  @inject(Types.AuthService) protected authService: AuthService;

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  public signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
  
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  public signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
