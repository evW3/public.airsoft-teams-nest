import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { getManager } from 'typeorm';

import { UsersSchema } from './schemas/transferUsers.schema';
import { TransportUserDto } from '../users/dto/transportUser.dto';
import { TransportUserSignInDto } from '../users/dto/transportUserSignIn.dto';
import { SchemaValidate } from '../../pipes/schemaValidate';
import { Users } from '../users/users.model';
import { Roles } from '../roles/roles.model';
import { RolesService } from '../roles/roles.service';
import { BcryptService } from './bcrypt.service';
import { TokenService } from './token.service';
import { UsersService } from '../users/users.service';


@Controller('auth')
export class AuthController {
    constructor(private readonly rolesService: RolesService,
                private readonly bcryptService: BcryptService,
                private readonly tokenService: TokenService,
                private readonly usersService: UsersService) {}

    @Post('/sign-up')
    @UsePipes(new SchemaValidate(UsersSchema))
    async signUp(@Body() transportUserDto: TransportUserDto) {
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
    }

    @Post('/sign-in')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() transportUserSignInDto: TransportUserSignInDto) {
        const userId = await this.usersService.getUserIdByEmail(transportUserSignInDto.email);
        const userSalt = await this.usersService.getUserSalt(userId);
        const encryptedPassword = await this.bcryptService.encryptBySalt(transportUserSignInDto.password, userSalt);
        const isUserValid = await this.usersService.validateUser(userId, encryptedPassword);

        if(isUserValid) {
            const token = this.tokenService.createToken(userId);
            return { token };
        } else {
            throw new HttpException('Email or password isn`t correct', HttpStatus.BAD_REQUEST);
        }
    }

    @Post('/tests')
    async test(@Body() transportUserSignInDto: TransportUserSignInDto) {
        console.log(transportUserSignInDto);
    }
}