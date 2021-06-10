import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { AuthService } from './auth.service';
import { transferUserSchema } from './schemas/TransferUserSchema';
import { TransferUserDto } from '../users/dto/transferUser.dto';
import { TransferUserSignInDto } from '../users/dto/transferUserSignIn.dto';
import { UniqueEmailValidation } from './pipes/uniqueEmailValidation';
import { PasswordMismatchValidation } from './pipes/passwordMismatchValidation';
import { IsExistEmailValidation } from './pipes/isExistEmailValidation';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-up')
    @UsePipes(new PasswordMismatchValidation(transferUserSchema))
    @UsePipes(UniqueEmailValidation)
    async signUp(@Body() userTransferDto: TransferUserDto) {
        return await this.authService.registration(userTransferDto);
    }

    @Post('sign-in')
    @UsePipes(IsExistEmailValidation)
    async signIn(@Body() transferUserSignInDto: TransferUserSignInDto) {
        return await this.authService.auth(transferUserSignInDto);
    }

    @Post('test')
    async test(@Body() transferUserSignInDto: TransferUserSignInDto) {
        console.log(transferUserSignInDto);
    }

}