import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../../services';
import { inject, Types } from '@biorate/inversion';
import { JwtGuard } from '../guards';
import { UserDecorator } from '../decorators';

@Controller('api')
export class UIController {
  @inject(Types.AuthService) protected authService: AuthService;

  @Get('')
  @UseGuards(JwtGuard)
  public test(@UserDecorator("sub") sub: number) {
    console.log('request', sub);

    return 'good';
  }
}
