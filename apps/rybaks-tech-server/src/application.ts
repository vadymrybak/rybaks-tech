import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as favicon from 'serve-favicon';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { promisify } from 'util';
import { urlencoded, json, Request, Response } from 'express';
import { init, kill, injectable, inject, Types } from '@biorate/inversion';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { IConfig } from '@biorate/config';
import { path } from '@biorate/tools';
import {
  RoutesInterceptor,
  AllExceptionsFilter,
} from '@biorate/nestjs-tools';
import { IApplication } from './interfaces';
import { AppModule } from './app';

@injectable()
export class Application implements IApplication<Server> {
  @inject(Types.Config) private config: IConfig;

  public app: INestApplication<Server>;
  public document: OpenAPIObject;

  private readonly logger: Logger = new Logger(Application.name);

  @kill() protected async kill() {
    if (!this.app?.getHttpServer) return;
    const server = this.app.getHttpServer();
    await promisify(server.close.bind(server))();
  }

  @init() protected async initialize() {
    const host = this.config.get<string>('app.host', '0.0.0.0');
    const port = this.config.get<number>('app.port', 3000);
    this.app = await NestFactory.create(AppModule, { logger: new Logger() });
    this.app.setGlobalPrefix(this.config.get<string>('app.globalPrefix', ''));
    this.app.useGlobalFilters(new AllExceptionsFilter());
    this.app.useGlobalInterceptors(new RoutesInterceptor());
    this.app.useGlobalPipes(new ValidationPipe());
    this.app.use(
      helmet(
        this.config.get<unknown>('app.middleware.helmet', {
          contentSecurityPolicy: false,
        }),
      ),
    );
    this.app.use(favicon(path.create(process.cwd(), 'favicon.ico')));
    this.app.use(
      json(this.config.get<unknown>('app.middleware.json', { limit: '100mb' })),
    );
    this.app.use(
      urlencoded(
        this.config.get<unknown>('app.middleware.urlencoded', {
          extended: true,
          limit: '100mb',
        }),
      ),
    );
    this.app.use(cookieParser());
    this.app.enableShutdownHooks();
    this.app.enableCors({
      credentials: true,
      origin: (origin, callback) => callback(null, origin),
    });
    this.createSwagger();
    await this.app.listen(port, host, () => {
      const { address, port } = <AddressInfo>this.app.getHttpServer().address();
      this.logger.log(`Server listen on ${address}:${port}`);
    });
  }

  private createSwagger() {
    const route = this.config.get<string>(
      'app.swagger.routes.documentation',
      '/swagger/json',
    );
    this.document = SwaggerModule.createDocument(
      this.app,
      new DocumentBuilder()
        .setTitle(this.config.get<string>('package.name'))
        .setDescription(
          this.config.get<string>('package.description') +
            `<br/><br/><a target="_blank" href="${route}">OpenAPI JSON config</a>`,
        )
        .setVersion(this.config.get<string>('package.version'))
        .build(),
    );
    SwaggerModule.setup(
      this.config.get<string>('app.swagger.routes.ui', 'swagger'),
      this.app,
      this.document,
    );
    this.app.use(route, (req: Request, res: Response) =>
      res.end(JSON.stringify(this.document)),
    );
  }
}
