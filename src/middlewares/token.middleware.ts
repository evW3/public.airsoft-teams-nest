import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { tokenBody } from '../utils/types';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const token: string | undefined = req?.headers?.authorization?.split(' ')[1];

            if(token) {
                const params = this.jwtService.verify(token);

                if(params.id) {
                    req.body = { ...req.body, ...params };
                    next();
                } else
                    next(new HttpException('Invalid token', HttpStatus.FORBIDDEN));

            } else
                next(new HttpException('Invalid token', HttpStatus.FORBIDDEN));

        } catch (e) {
            if(e instanceof HttpException)
                next(e);
            else
                next(new HttpException('Invalid token', HttpStatus.FORBIDDEN));
        }
    }
}
