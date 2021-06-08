import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { BcryptStrategies } from './bcryptStrategies';

@Module({
    imports: [UsersModule],
    providers: [AuthService, BcryptStrategies],
    controllers: [AuthController],
    exports: [AuthModule]
})
export class AuthModule {}