import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { MyLogger } from './utils/logger';
import { connect, model } from 'mongoose';
import { ErrorsScheme } from './models/errors.schema';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function start() {
    try {
        const PORT = process.env.PORT || 3000;
        await connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });
        const Errors = model("Errors", ErrorsScheme);
        const app = await NestFactory.create(AppModule);
        app.useGlobalFilters(new HttpExceptionFilter(Errors))
        await app.listen(PORT, () => console.log(`Server start on port:${ PORT }`));
    } catch (e) {
        console.log(e);
    }
}

//{
//    logger: new MyLogger(Errors)
//}
start();