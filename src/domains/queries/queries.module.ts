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
import { CommentsService } from './comments.service';
import { Comments } from './comments.model';
import { QueryParamsService } from './queryParams.service';
import { QueryParams } from './queryParams.model';
import { IsUserInTeamMiddleware } from './middlewares/isUserInTeam.middleware';
import { IsTeamNameExistsMiddleware } from '../teams/middleware/isTeamNameExists.middleware';
import { IsUserWithoutTeamMiddleware } from './middlewares/isUserWithoutTeam.middleware';

@Module({
    imports: [
        TypeOrmModule.forFeature([Users, Queries, Comments, QueryParams]),
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
    providers: [QueriesService, CommentsService, QueryParamsService],
    exports: [QueriesService, CommentsService]
})
export class QueriesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware)
            .forRoutes('queries/',
                        'queries/change-role',
                        'queries/join-team',
                        'queries/exit-team');

        consumer
            .apply(IsUserInTeamMiddleware)
            .forRoutes('queries/join-team', 'queries/change-role');

        consumer
            .apply(IsTeamNameExistsMiddleware)
            .forRoutes('queries/join-team');

        consumer
            .apply(IsUserWithoutTeamMiddleware)
            .forRoutes('queries/exit-team');
    }
}
