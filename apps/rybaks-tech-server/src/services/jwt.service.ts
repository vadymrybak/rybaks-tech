import { inject, injectable, Types } from "@biorate/inversion";
import { JwtService } from "@nestjs/jwt";

@injectable()
export class BJwtService extends JwtService {}
