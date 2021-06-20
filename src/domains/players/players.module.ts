import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { QueriesModule } from '../queries/queries.module';
import { TokenMiddleware } from '../../middlewares/token.middleware';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TeamsModule } from '../teams/teams.module';
import { BlockListModule } from '../blockList/blockList.module';
import { IsUserInBlockListMiddleware } from '../../middlewares/isUserInBlockList.middleware';
import { IsUserNotBlockedMiddleware } from '../../middlewares/isUserNotBlocked.middleware';
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
                'players/accept-exit-team',
                'players/decline-exit-team',
                'players/exclude-from-team',
                'players/block',
                'players/unblock'
            );

        consumer
            .apply(IsUserInBlockListMiddleware)
            .forRoutes('players/unblock');

        consumer
            .apply(IsUserNotBlockedMiddleware)
            .forRoutes('players/block');
    }
}