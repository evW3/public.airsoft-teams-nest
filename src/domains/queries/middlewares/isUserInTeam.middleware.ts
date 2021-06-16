import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UsersService } from '../../users/users.service';

@Injectable()
export class IsUserInTeamMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.body.id;
            const isUserInTeam = await this.usersService.isUserHaveTeam(userId);

            if(isUserInTeam) {
                next(new HttpException('Player already in team', HttpStatus.BAD_REQUEST));
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
