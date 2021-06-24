import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { TokenService } from './token.service';

dotenv.config()

describe('[UNIT] Token service', () => {
    let tokenService: TokenService;
    const mockDataToHash = 1;
    let token = '';
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: process.env.TOKEN_CODE_KEY,
                    signOptions: { expiresIn: process.env.TOKEN_CODE_EXPIRES_IN }
                }),
            ],
            providers: [
                TokenService
            ],
        }).compile();
        tokenService = await module.get<TokenService>(TokenService);
    });

    it('should return token', async () => {
        token = tokenService.createToken(mockDataToHash)
        expect(token).not.toBeUndefined();
    });

    it('should decrypt data from token', async () => {
       expect(tokenService.decryptToken(token)).toEqual({ id: mockDataToHash });
    });
});