import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teams } from './teams.model';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { TokenMiddleware } from '../../middlewares/token.middleware';
import { IsUniqueNameMiddleware } from './middleware/isUniqueName.middleware';


@Module({
    imports: [
        TypeOrmModule.forFeature([Teams]),
        JwtModule.register({
            secret: process.env.TOKEN_SECRET_KEY,
            signOptions: { expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN }
        }),
        UsersModule
    ],
    controllers: [TeamsController],
    providers: [TeamsService],
    exports: [TeamsService]
})
export class TeamsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware, IsUniqueNameMiddleware)
            .forRoutes('teams/');
    }
}
