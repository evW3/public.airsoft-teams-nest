import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
//import { HttpExceptionFilter } from './filters/http-exception.filter';

async function start() {
    const PORT = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);
    //app.useGlobalFilters(new HttpExceptionFilter(new ErrorsService()))
    await app.listen(PORT, () => console.log(`Server start on port:${ PORT }`));
}
start();