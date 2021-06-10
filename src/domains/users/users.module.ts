import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersService } from './users.service';
import { SMTPService } from './SMTP.service';
import { VerificationCodesService } from './verificationCodes.service';
import { Users } from './users.model';
import { VerificationCodes } from './verificationCodes.model';
import { TokenService } from '../auth/token.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Users, VerificationCodes]),
        ConfigModule.forRoot({
            envFilePath: [`.${process.env.NODE_ENV}.env`]
        }),
        TokenService
    ],
    providers: [UsersService, SMTPService, VerificationCodesService],
    exports: [UsersService, SMTPService]
})
export class UsersModule {}
