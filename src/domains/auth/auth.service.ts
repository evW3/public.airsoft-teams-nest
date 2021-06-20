import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { getManager } from 'typeorm';

import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { Users } from '../users/users.model';
import { Roles } from '../roles/roles.model';
import { TransportUserDto } from '../users/dto/transportUser.dto';
import { TransportUserSignInDto } from '../users/dto/transportUserSignIn.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly rolesService: RolesService,
        private readonly bcryptService: BcryptService,
        private readonly tokenService: TokenService
    ) {}

    async registration(transportUserDto: TransportUserDto) {
        try {
            const playerId = await this.rolesService.getRoleIdByName('PLAYER');
            const cryptResult = await this.bcryptService.encrypt(transportUserDto.password);
            const userEntity = new Users();
            const roleEntity = await getManager().findOne(Roles, playerId);

            userEntity.email = transportUserDto.email;
            userEntity.password = cryptResult.encryptedPassword;
            userEntity.password_salt = cryptResult.salt;
            userEntity.role = roleEntity;

            const newUserEntity = await this.usersService.save(userEntity);
            const token = this.tokenService.createToken(newUserEntity.id);

            return { token };
        } catch (e) {
            throw new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async auth(transportUserDto: TransportUserSignInDto) {
        try {
            const userId = await this.usersService.getUserIdByEmail(transportUserDto.email);
            const userSalt = await this.usersService.getUserSalt(userId);
            const encryptedPassword = await this.bcryptService.encryptBySalt(transportUserDto.password, userSalt);
            const isUserValid = await this.usersService.validateUser(userId, encryptedPassword);

            if(isUserValid) {
                const token = this.tokenService.createToken(userId);
                return { token };
            } else {
                throw new HttpException('Email or password isn`t correct', HttpStatus.BAD_REQUEST);
            }
        } catch (e) {
            if(e instanceof HttpException) {
                throw e
            } else {
                throw new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}