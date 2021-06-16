import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { QueriesModule } from '../queries/queries.module';
import { ManagersController } from './managers.controller';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { BlockListModule } from '../blockList/blockList.module';
import { TokenMiddleware } from '../../middlewares/token.middleware';
import { JwtModule } from '@nestjs/jwt';
import { IsUserInBlockList } from '../../middlewares/isUserInBlockList';
import { IsUserNotBlocked } from '../../middlewares/isUserNotBlocked';

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
            .apply(IsUserInBlockList)
            .forRoutes('players/unblock');

        consumer
            .apply(IsUserNotBlocked)
            .forRoutes('players/block');
    }
}