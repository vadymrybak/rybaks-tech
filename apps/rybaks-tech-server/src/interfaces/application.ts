import { INestApplication } from "@nestjs/common";

export interface IApplication<T = any> {
  app: INestApplication<T>;
}
