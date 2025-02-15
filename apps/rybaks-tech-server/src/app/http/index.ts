import { RequestCountMiddleware, ResponseTimeMiddleware, RolesGuardProvider } from "@biorate/nestjs-tools";
import { path } from "@biorate/tools";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as controllers from "./controllers";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.create(process.cwd(), "../rybaks-tech-client/dist"),
    }),
  ],
  controllers: [...Object.values(controllers)],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuardProvider,
    },
  ],
})
export class HttpModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResponseTimeMiddleware).forRoutes("*");
    consumer.apply(RequestCountMiddleware).forRoutes("*");
  }
}
