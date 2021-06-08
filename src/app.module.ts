import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ErrorModule } from './domains/errors/error.module';
import { UsersModule } from './domains/users/users.module';
import { AuthModule } from './domains/auth/auth.module';
import { Users } from './domains/users/users.model';
import { BlockList } from './models/blockList.model';
import { Comments } from './models/comments.model';
import { Devices } from './models/devices.model';
import { Permissions } from './models/permissions.model';
import { Queries } from './models/queries.model';
import { QueryParams } from './models/queryParams.model';
import { Roles } from './models/roles.model';
import { Teams } from './models/teams.model';
import { VerificationCodes } from './models/verificationCodes.model';


@Module({
    controllers: [],
    providers:[],
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.${ process.env.NODE_ENV }.env`, '.env']
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
        MongooseModule.forRoot(process.env.MONGO_URI),
        ErrorModule,
        UsersModule,
        AuthModule
    ]
})
export class AppModule {}