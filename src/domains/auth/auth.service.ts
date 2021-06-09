import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptStrategies } from './bcryptStrategies';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { TransferUserDto } from '../users/dto/transferUser.dto';
import { Users } from '../users/users.model';
import { getManager } from 'typeorm';

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

            const entityManager = getManager();
            const userEntity = await entityManager.findOne(Users, 1);

            userCreateDto.Email = userTransferDto.email;
            userCreateDto.Password = cryptResult.encryptedPassword;
            userCreateDto.Password_salt = cryptResult.salt;
            userCreateDto.Role_id = playerId;

            const user = await this.usersService.create(userCreateDto);
            const token = this.createToken(1);

            return { token };
        } else
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST)
    }

    private createToken(userId: number): string {
        return this.jwtService.sign({ id: userId });
    }
}