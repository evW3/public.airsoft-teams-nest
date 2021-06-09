import { Body, Controller, Post } from '@nestjs/common';
import { TransferUserDto } from '../users/dto/transferUser.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/sign-in")
    async signIn(@Body() userTransferDto: TransferUserDto) {
        return await this.authService.registration(userTransferDto);
    }
}