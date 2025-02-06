import { SequelizeConnector } from '@biorate/sequelize';
import { Images, User } from '../models';

// Assign models with sequelize connector
export class ServiceApiSequelizeConnector extends SequelizeConnector {
  protected readonly models = { rybaksTech: [Images, User] };
}
