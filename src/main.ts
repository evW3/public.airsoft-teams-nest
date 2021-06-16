import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { BlockListGuard } from './guards/blockList.guard';
import { UsersService } from './domains/users/users.service';
import { Repository } from 'typeorm';
import { Users } from './domains/users/users.model';
import { InjectRepository } from '@nestjs/typeorm';
import { SMTPService } from './domains/users/SMTP.service';
import { TokenService } from './domains/auth/token.service';
//import { HttpExceptionFilter } from './filters/http-exception.filter';

async function start() {
    const PORT = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);
    //app.useGlobalFilters(new HttpExceptionFilter(new ErrorsService()))
    await app.listen(PORT, () => console.log(`Server start on port:${ PORT }`));
}
start();