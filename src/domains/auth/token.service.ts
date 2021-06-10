import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    createToken(userId: number): string {
        return this.jwtService.sign(
            { id: userId },
            {
                secret: process.env.TOKEN_SECRET_KEY,
                expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN
            });
    }

    createRecoverToken(userId: number, codeId: number): string {
        return this.jwtService.sign(
            { id: userId, codeId },
            {
                secret: process.env.TOKEN_CODE_KEY,
                expiresIn: process.env.TOKEN_CODE_EXPIRES_IN
            });
    }
}