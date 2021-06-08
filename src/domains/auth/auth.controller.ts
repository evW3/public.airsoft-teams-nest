import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/sign-in")
    async signIn(@Body() userDto: CreateUserDto) {
        await this.authService.registration(userDto);
    }
}