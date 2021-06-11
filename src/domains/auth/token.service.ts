import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    createToken(userId: number): string {
        return this.jwtService.sign({ id: userId });
    }

    createRecoverToken(userId: number, codeId: number): string {
        return this.jwtService.sign({ id: userId, codeId });
    }
}