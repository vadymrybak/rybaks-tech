import { IConfig } from "@biorate/config";
import { inject, injectable, Types } from "@biorate/inversion";
import { Logger } from "@nestjs/common";
import { Images } from "../models";

@injectable()
export class DbService {
    private readonly logger: Logger = new Logger(DbService.name);

    @inject(Types.Config) private config: IConfig;

    public async getStuff(){
        return Images.findAll(); 
    }
} 