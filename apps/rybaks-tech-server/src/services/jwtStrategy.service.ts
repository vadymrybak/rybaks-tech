import { IConfig } from "@biorate/config";
import { container, injectable, Types } from "@biorate/inversion";
import { PassportStrategy } from "@nestjs/passport";
import { ForbiddenException, Logger } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../models";

@injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  private readonly logger: Logger = new Logger(JwtStrategy.name);

  constructor() {
    const conf: IConfig = container.get(Types.Config);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: conf.get("JWT_SECRET"),
    });
  }

  public async validate(payload: { sub: number; email: string }) {
    this.logger.debug(`(validate) Processing request. ${JSON.stringify(payload)}`);

    const user = await User.findByPk(payload.sub);

    if (!user) {
      this.logger.warn(`(JwtStrategy) Token for ${payload.sub} was fine, but user was not found in DB`);
      throw new ForbiddenException();
    }

    return payload;
  }
}
