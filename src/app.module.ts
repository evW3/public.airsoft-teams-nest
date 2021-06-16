import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ErrorModule } from './domains/errors/error.module';
import { UsersModule } from './domains/users/users.module';
import { AuthModule } from './domains/auth/auth.module';
import { Users } from './domains/users/users.model';
import { BlockList } from './domains/blockList/blockList.model';
import { Comments } from './domains/queries/comments.model';
import { Devices } from './models/devices.model';
import { Permissions } from './domains/roles/permissions.model';
import { Queries } from './domains/queries/queries.model';
import { QueryParams } from './domains/queries/queryParams.model';
import { Roles } from './domains/roles/roles.model';
import { Teams } from './domains/teams/teams.model';
import { VerificationCodes } from './domains/users/verificationCodes.model';
import { RolesModule } from './domains/roles/roles.module';
import { TokenMiddleware } from './middlewares/token.middleware';
import { JwtModule } from '@nestjs/jwt';
import { QueriesModule } from './domains/queries/queries.module';
import { TeamsModule } from './domains/teams/teams.module';
import { BlockListModule } from './domains/blockList/blockList.module';
import { ManagersModule } from './domains/managers/managers.module';
import { PlayersModule } from './domains/players/players.module';


@Module({
    controllers: [],
    providers:[],
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.${ process.env.NODE_ENV }.env`, '.env']
        }),
        JwtModule.register({
            secret: process.env.TOKEN_SECRET_KEY,
            signOptions: { expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN },
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_LOGIN,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB_NAME,
            entities: [
                Users,
                BlockList,
                Comments,
                Devices,
                Permissions,
                Queries,
                QueryParams,
                Roles,
                Teams,
                VerificationCodes
            ]
        }),

        AuthModule,
        UsersModule,
        BlockListModule,
        RolesModule,
        QueriesModule,
        TeamsModule,
        ManagersModule,
        PlayersModule
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TokenMiddleware)
            .forRoutes('auth/test');
    }
}

//MongooseModule.forRoot(process.env.MONGO_URI),
//ErrorModule