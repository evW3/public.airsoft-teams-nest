import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { BcryptService } from './bcrypt.service';
import { RolesModule } from '../roles/roles.module';
import { TokenService } from './token.service';
import { UniqueEmailMiddleware } from '../../middlewares/uniqueEmail.middleware';
import { IsExistsEmailMiddleware } from '../../middlewares/isExistsEmail.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env']
        }),
        JwtModule.register({
            secret: process.env.TOKEN_SECRET_KEY,
            signOptions: { expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN }
        }),
        forwardRef(() => UsersModule),
        RolesModule
    ],
    providers: [BcryptService, TokenService],
    controllers: [AuthController],
    exports: [TokenService, BcryptService]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(UniqueEmailMiddleware)
            .forRoutes('auth/sign-up');
        consumer
            .apply(IsExistsEmailMiddleware)
            .forRoutes('auth/sign-in');
    }
}