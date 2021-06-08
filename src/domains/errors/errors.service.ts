import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Errors, ErrorsDocument } from './errors.schema';
import { Model } from 'mongoose';
import { CreateErrorDto } from './dto/create-error.dto';

@Injectable()
export class ErrorsService {
    constructor(@InjectModel(Errors.name) private errorsModel: Model<ErrorsDocument>) {}

    async create(createErrorDto: CreateErrorDto) {
        const errors = new this.errorsModel(createErrorDto);
        await errors.save();
    }
}
