import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { QueriesModule } from '../queries/queries.module';
import { TokenMiddleware } from '../../middlewares/token.middleware';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TeamsModule } from '../teams/teams.module';
import { BlockListModule } from '../blockList/blockList.module';
import { IsUserInBlockList } from '../../middlewares/isUserInBlockList';
import { IsUserNotBlocked } from '../../middlewares/isUserNotBlocked';
import { SMTPService } from '../users/SMTP.service';

@Module({
    imports: [
        QueriesModule,
        UsersModule,
        TeamsModule,
        BlockListModule,
        SMTPService,
        JwtModule.register({
            secret: process.env.TOKEN_SECRET_KEY,
            signOptions: { expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN }
        })
    ],
    controllers: [PlayersController]
})
export class PlayersModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware)
            .forRoutes(
                'players/accept-join-team',
                'players/decline-join-team',
                'players/exclude-from-team'
            );

        consumer
            .apply(IsUserInBlockList)
            .forRoutes('players/unblock');

        consumer
            .apply(IsUserNotBlocked)
            .forRoutes('players/block');
    }
}