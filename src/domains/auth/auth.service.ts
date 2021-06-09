import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptStrategies } from './bcryptStrategies';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { TransferUserDto } from '../users/dto/transferUser.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly rolesService: RolesService,
        private readonly bcryptStrategies: BcryptStrategies,
        private readonly jwtService: JwtService
    ) {}

    async registration(userTransferDto: TransferUserDto) {
        let userCreateDto: CreateUserDto = new CreateUserDto();
        const playerId = await this.rolesService.getRoleIdByName('PLAYER');
        const isUserEmailUnique = await this.usersService.isUserEmailUnique(userTransferDto.email);
        if(isUserEmailUnique) {
            const cryptResult = await this.bcryptStrategies.encrypt(userTransferDto.password);

            userCreateDto.password = cryptResult.encryptedPassword;
            userCreateDto.password_salt = cryptResult.salt;
            userCreateDto.email = userTransferDto.email;
            userCreateDto.role_id = playerId;

            const user = await this.usersService.create(userCreateDto);

            return this.createToken(user.id);
        } else
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)
    }

    private createToken(userId: number): string {
        return this.jwtService.sign({ id: userId });
    }
}