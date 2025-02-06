import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { inject, Types } from '@biorate/inversion';
import { IConfig } from '@biorate/config';
import { DbService } from '../../../services';

@ApiTags('Debug')
@Controller('debug')
export class DebugController {
  @inject(Types.Config) protected config: IConfig;
  @inject(Types.DbService) protected dbService: DbService;

  @Get()
  @ApiOperation({ summary: 'Debug info' })
  private async get() {
    return {
      name: this.config.get<string>('package.name', 'unknown'),
      version: this.config.get<string>('package.version', 'unknown'),
    };
  }

  @Get('db')
  private async db() {
    return this.dbService.getStuff();
  }
}
