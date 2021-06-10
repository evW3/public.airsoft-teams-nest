import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptStrategies } from './bcryptStrategies';
import { JwtService } from '@nestjs/jwt';
import { getManager } from 'typeorm';

import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { Users } from '../users/users.model';
import { Roles } from '../roles/roles.model';
import { TransferUserDto } from '../users/dto/transferUser.dto';
import { TransferUserSignInDto } from '../users/dto/transferUserSignIn.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly rolesService: RolesService,
        private readonly bcryptStrategies: BcryptStrategies,
        private readonly tokenService: TokenService
    ) {}

    async registration(userTransferDto: TransferUserDto) {
        try {
            const playerId = await this.rolesService.getRoleIdByName('PLAYER');
            const cryptResult = await this.bcryptStrategies.encrypt(userTransferDto.password);
            const userEntity = new Users();
            const roleEntity = await getManager().findOne(Roles, playerId);

            userEntity.email = userTransferDto.email;
            userEntity.password = cryptResult.encryptedPassword;
            userEntity.password_salt = cryptResult.salt;
            userEntity.role = roleEntity;

            const userId = await this.usersService.create(userEntity);
            const token = this.tokenService.createToken(userId);

            return { token };
        } catch (e) {
            throw new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async auth(transferUserSignInDto: TransferUserSignInDto) {

    }
}