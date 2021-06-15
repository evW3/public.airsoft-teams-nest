import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { TransportUserDto } from '../domains/users/dto/transportUser.dto';

@Injectable()
export class SchemaValidate implements PipeTransform {
    constructor(private schema: ObjectSchema) {}

    transform(value: any, metadata: ArgumentMetadata) {
        const { error } = this.schema.validate(value);
        if (error) {
            throw new HttpException('The expected request body does not match the received one', HttpStatus.BAD_REQUEST);
        }
        return value;
    }
}