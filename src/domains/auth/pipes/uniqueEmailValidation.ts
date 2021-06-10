import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { TransferUserDto } from '../../users/dto/transferUser.dto';
import { UsersService } from '../../users/users.service';

@Injectable()
export class UniqueEmailValidation implements PipeTransform {
    constructor(private readonly usersService: UsersService) {}

    async transform(value: TransferUserDto, metadata: ArgumentMetadata) {
        const isEmailUnique = await this.usersService.isUserEmailUnique(value.email);

        if(!isEmailUnique)
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);

        return value;
    }
}