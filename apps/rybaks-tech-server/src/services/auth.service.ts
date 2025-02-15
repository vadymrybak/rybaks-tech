import { inject, injectable, Types } from "@biorate/inversion";
import { ForbiddenException, InternalServerErrorException, Logger } from "@nestjs/common";
import * as argon from "argon2";
import { IConfig } from "@biorate/config";
import { UniqueConstraintError } from "sequelize";
import { AuthDto } from "../app/http/dto";
import { User } from "../models";
import { BJwtService } from "./jwt.service";

@injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  @inject(Types.Config) private config: IConfig;

  @inject(Types.BJwtService) private jwt: BJwtService;

  public async signin(dto: AuthDto) {
    this.logger.debug(`(signin) Processing request. ${JSON.stringify(dto)}...`);

    try {
      const user = await User.findOne({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new ForbiddenException();
      }

      const pwMatches = await argon.verify(user.hash, dto.password);

      if (!pwMatches) {
        throw new ForbiddenException("Invalid credentials");
      }

      return await this.signToken(user.id, user.email);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException();
      }
      throw new InternalServerErrorException();
    }
  }

  public async signup(dto: AuthDto) {
    this.logger.debug(`(signup) Processing request. ${JSON.stringify(dto)}...`);

    const hash = await argon.hash(dto.password);

    try {
      const user: User = await User.create({
        email: dto.email,
        hash,
      });

      return await this.signToken(user.id, user.email);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof UniqueConstraintError) {
        throw new ForbiddenException("Account taken");
      }
      throw new InternalServerErrorException();
    }
  }

  public async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: "60m",
      secret: this.config.get("JWT_SECRET"),
    });
    return {
      access_token: token,
    };
  }
}
