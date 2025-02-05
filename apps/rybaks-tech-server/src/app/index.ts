import { Module } from '@nestjs/common';
import { HttpModule } from './http';

@Module({
  imports: [HttpModule],
})
export class AppModule {}
