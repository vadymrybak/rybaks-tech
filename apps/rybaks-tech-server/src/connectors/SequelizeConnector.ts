import { SequelizeConnector } from "@biorate/sequelize";
import * as models from "../models";

// Assign models with sequelize connector
export class ServiceApiSequelizeConnector extends SequelizeConnector {
  protected readonly models = { rybaksTech: [...Object.values(models)] };
}
