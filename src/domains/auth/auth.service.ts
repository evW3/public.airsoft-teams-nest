import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { BcryptStrategies } from './bcryptStrategies';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
                private readonly bcryptStrategies: BcryptStrategies
    ) {}

    async registration(userDto: CreateUserDto) {
        const cryptResult = await this.bcryptStrategies.encrypt(userDto.password);
        userDto.password_salt = cryptResult.salt;
        userDto.password = cryptResult.encryptedPassword;
        const user = await this.usersService.getUserByEmail(userDto.email);
        console.log(user);
    }
}