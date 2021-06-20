import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UsersService } from '../domains/users/users.service';

@Injectable()
export class IsUserInBlockListMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.body.playerId || req.body.managerId;
            const isBannedUser = await this.usersService.isUserInBlockList(userId);

            if(!isBannedUser) {
                next(new HttpException('Can`t find user in ban list', HttpStatus.BAD_REQUEST));
            } else {
                next();
            }
        } catch (e) {
            if(e instanceof HttpException)
                next(e);
            else
                next(new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }
}
