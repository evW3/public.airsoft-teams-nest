import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { QueriesModule } from '../queries/queries.module';
import { ManagersController } from './managers.controller';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { BlockListModule } from '../blockList/blockList.module';
import { TokenMiddleware } from '../../middlewares/token.middleware';
import { JwtModule } from '@nestjs/jwt';
import { IsUserInBlockListMiddleware } from '../../middlewares/isUserInBlockList.middleware';
import { IsUserNotBlockedMiddleware } from '../../middlewares/isUserNotBlocked.middleware';

@Module({
    imports: [
        QueriesModule,
        RolesModule,
        UsersModule,
        BlockListModule,
        JwtModule.register({
            secret: process.env.TOKEN_SECRET_KEY,
            signOptions: { expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN }
        }),
    ],
    controllers: [ManagersController]
})
export class ManagersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware)
            .forRoutes(
                'managers/block',
                'managers/unblock',
                'managers/:id'
            );

        consumer
            .apply(IsUserInBlockListMiddleware)
            .forRoutes('players/unblock');

        consumer
            .apply(IsUserNotBlockedMiddleware)
            .forRoutes('players/block');
    }
}