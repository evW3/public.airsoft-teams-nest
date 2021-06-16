import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersSchema } from './schemas/transferUsers.schema';
import { TransportUserDto } from '../users/dto/transportUser.dto';
import { TransportUserSignInDto } from '../users/dto/transportUserSignIn.dto';
import { SchemaValidate } from '../../pipes/schemaValidate';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/sign-up')
    @UsePipes(new SchemaValidate(UsersSchema))
    async signUp(@Body() userTransferDto: TransportUserDto) {
        return await this.authService.registration(userTransferDto);
    }

    @Post('/sign-in')
    async signIn(@Body() transportUserSignInDto: TransportUserSignInDto) {
        return await this.authService.auth(transportUserSignInDto);
    }

    @Post('/test')
    async test(@Body() transportUserSignInDto: TransportUserSignInDto) {
        console.log(transportUserSignInDto);
    }
}