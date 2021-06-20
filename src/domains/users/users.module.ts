import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersService } from './users.service';
import { SMTPService } from './SMTP.service';
import { VerificationCodesService } from './verificationCodes.service';
import { Users } from './users.model';
import { VerificationCodes } from './verificationCodes.model';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { TokenMiddleware } from '../../middlewares/token.middleware';
import { IsUserHaveVerificationCodeMiddleware } from './middlewares/isUserHaveVerificationCode.middleware';
import { IsExistsEmailMiddleware } from '../../middlewares/isExistsEmail.middleware';
import { BlockListModule } from '../blockList/blockList.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Users, VerificationCodes]),
        ConfigModule.forRoot({
            envFilePath: [`.${process.env.NODE_ENV}.env`]
        }),
        JwtModule.register({
            secret: process.env.TOKEN_CODE_KEY,
            signOptions: { expiresIn: process.env.TOKEN_CODE_EXPIRES_IN }
        }),
        forwardRef(() => AuthModule),
        BlockListModule
    ],
    controllers: [UsersController],
    providers: [UsersService, SMTPService, VerificationCodesService],
    exports: [UsersService, SMTPService]
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(IsUserHaveVerificationCodeMiddleware)
            .forRoutes('users/recover-password');
        consumer
            .apply(IsExistsEmailMiddleware)
            .forRoutes('users/send-recover-code');
        consumer
            .apply(TokenMiddleware)
            .forRoutes('users/profile',
                        'users/upload-user-photo',
                        'users/recover-password');
    }
}
