import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './post/post.module';
import { ValidationModule } from './modules/validation/validation.module';
import { RedirectModule } from './modules/redirect/redirect.module';
import { FileModule } from './modules/file/file.module';
import { InputModule } from './modules/input/input.module';
import { VulnerableParamsMiddleware } from './vulnerable-params.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'user',
      password: 'password',
      database: 'hermes-weak-website-db',
      entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    PostModule,
    ValidationModule,
    RedirectModule,
    FileModule,
    InputModule,
  ]
})
export class AppModule implements NestModule {
  // V5.1.1: Apply the vulnerable middleware globally
  configure(consumer: MiddlewareConsumer) {
    // Apply the middleware to all routes, making the entire app vulnerable to parameter pollution
    consumer.apply(VulnerableParamsMiddleware).forRoutes('*');
  }
}
