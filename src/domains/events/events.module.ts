import { forwardRef, Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UsersModule),
        JwtModule.register({
            secret: process.env.TOKEN_SECRET_KEY,
            signOptions: { expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN }
        }),
    ],
    providers: [EventsGateway],
    exports: [EventsGateway]
})
export class EventsModule {}