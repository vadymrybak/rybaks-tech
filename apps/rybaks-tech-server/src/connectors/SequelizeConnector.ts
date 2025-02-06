import { SequelizeConnector } from '@biorate/sequelize';
import { Images } from '../models';

// Assign models with sequelize connector
export class ServiceApiSequelizeConnector extends SequelizeConnector {
  protected readonly models = { rybaksTech: [Images] };
}
