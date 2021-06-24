import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { connect, model } from 'mongoose';
import { join } from 'path';
import {createConnection} from "typeorm";

import { AppModule } from './app.module';
import { ErrorsScheme } from './models/errors.schema';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function start() {
    try {
        const PORT = process.env.PORT || 3000;
        await connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });

        const connection = await createConnection({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_LOGIN,
            password: process.env.POSTGRES_PASSWORD
        });
        console.log('1');
        await connection.query(`CREATE DATABASE ${process.env.POSTGRES_DB_NAME}`);

        const Errors = model("Errors", ErrorsScheme);
        const app = await NestFactory.create<NestExpressApplication>(AppModule);

        app.useStaticAssets(join(__dirname, '..', '..', 'client'));
        app.useGlobalFilters(new HttpExceptionFilter(Errors));

        await app.listen(PORT, () => console.log(`Server start on port:${ PORT }`));
    } catch (e) {
        console.log(e);
    }
}
start();