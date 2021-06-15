import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queries } from './queries.model';
import { Users } from '../users/users.model';
import { QueriesController } from './queries.controller';
import { QueriesService } from './queries.service';
import { TokenMiddleware } from '../../middlewares/token.middleware';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Users, Queries]),
        ConfigModule.forRoot({
            envFilePath: ['.env']
        }),
        JwtModule.register({
            secret: process.env.TOKEN_SECRET_KEY,
            signOptions: { expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN }
        }),
        UsersModule
    ],
    controllers: [QueriesController],
    providers: [QueriesService],
    exports: [QueriesService]
})
export class QueriesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware)
            .forRoutes('queries/',
                        'queries/change-role',
                        'queries/join-team',
                        'queries/exit-team');
    }
}
