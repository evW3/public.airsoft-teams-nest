import { Module } from '@nestjs/common';
import { ErrorsService } from './errors.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Errors, ErrorsSchema } from './errors.schema';

@Module({

})
export class ErrorModule {}

//    imports: [MongooseModule.forFeature([{ name: Errors.name, schema: ErrorsSchema }])],
//     providers: [ErrorsService],
//     exports: [ErrorsService]