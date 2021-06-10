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
export class IsExistEmailValidation implements PipeTransform {
    constructor(private readonly usersService: UsersService) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        const isUserExists = await this.usersService.isExistsEmail(value.email);

        if(!isUserExists)
            throw new HttpException('Can`t find user', HttpStatus.BAD_REQUEST);

        return value;
    }
}