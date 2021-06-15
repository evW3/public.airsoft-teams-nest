import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UsersService } from '../domains/users/users.service';

@Injectable()
export class IsExistsEmailMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const isUserExists = await this.usersService.isExistsEmail(req.body.email);

            if(!isUserExists) {
                next(new HttpException('Can`t find user', HttpStatus.BAD_REQUEST));
            } else {
                next()
            }
        } catch (e) {
            if(e instanceof HttpException)
                next(e);
            else
                next(new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }
}
