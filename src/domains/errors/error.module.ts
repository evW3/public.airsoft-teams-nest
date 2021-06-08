import { Module } from '@nestjs/common';
import { ErrorsService } from './errors.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Errors, ErrorsSchema } from './errors.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Errors.name, schema: ErrorsSchema }])],
    providers: [ErrorsService],
    exports: [ErrorsService]
})
export class ErrorModule {}