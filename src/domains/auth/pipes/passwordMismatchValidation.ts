import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { TransferUserDto } from '../../users/dto/transferUser.dto';

@Injectable()
export class PasswordMismatchValidation implements PipeTransform {
    constructor(private schema: ObjectSchema) {}

    transform(value: TransferUserDto, metadata: ArgumentMetadata) {
        const { error } = this.schema.validate(value);
        if (error) {
            throw new HttpException('The expected request body does not match the received one', HttpStatus.BAD_REQUEST);
        }
        return value;
    }
}