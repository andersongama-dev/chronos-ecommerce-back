import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { ConfigModule } from '@nestjs/config';
import { WatchesModule } from './watches/watches.module';
import { CartsModule } from './carts/carts.module';
import { CartsController } from './carts/carts.controller';

@Module({
  imports: [UsersModule, AuthModule, ConfigModule.forRoot({isGlobal: true}), WatchesModule, CartsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(UsersController, CartsController);
  }
}

