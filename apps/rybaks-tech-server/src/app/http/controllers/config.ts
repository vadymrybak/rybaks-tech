import { Controller, Get, Logger, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { inject, Types } from "@biorate/inversion";
import { IConfig } from "@biorate/config";
import { JwtGuard } from "../guards";

@ApiTags("Config")
@Controller("api/config")
export class ConfigController {
  private readonly logger: Logger = new Logger(ConfigController.name);
  @inject(Types.Config) protected config: IConfig;

  @Get()
  @ApiOperation({ summary: "Get client config" })
  @UseGuards(JwtGuard)
  protected getConfig() {
    this.logger.debug(`(getConfig) Incoming request`);

    return {
      ENV: this.config.get<string>("ENV", "debug"),
      version: this.config.get<string>("package.version"),
    };
  }
}
