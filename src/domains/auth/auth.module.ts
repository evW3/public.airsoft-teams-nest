import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { BcryptStrategies } from './bcryptStrategies';
import { RolesModule } from '../roles/roles.module';
import { TokenService } from './token.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env']
        }),
        JwtModule,
        UsersModule,
        RolesModule
    ],
    providers: [AuthService, BcryptStrategies, TokenService],
    controllers: [AuthController],
    exports: [TokenService]
})
export class AuthModule {}