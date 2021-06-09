import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { BcryptStrategies } from './bcryptStrategies';
import { RolesModule } from '../roles/roles.module';

@Module({
    imports: [
        UsersModule,
        RolesModule,
        JwtModule.register({
            secret: '4P=]Mi0+PY54W]HkXbiu',
            signOptions: { expiresIn: '24h' },
        })
    ],
    providers: [AuthService, BcryptStrategies],
    controllers: [AuthController],
    exports: [AuthModule]
})
export class AuthModule {}