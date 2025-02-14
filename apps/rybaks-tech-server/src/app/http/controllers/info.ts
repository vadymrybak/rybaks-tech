import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { inject, Types } from "@biorate/inversion";
import { IConfig } from "@biorate/config";

@ApiTags("Info")
@Controller("/")
export class InfoController {
  @inject(Types.Config) protected config: IConfig;

  @Get()
  @ApiOperation({ summary: "Get info" })
  protected get() {
    return {
      version: this.config.get<string>("package.version"),
    };
  }
}
