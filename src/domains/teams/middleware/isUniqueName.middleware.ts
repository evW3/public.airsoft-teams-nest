import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { TeamsService } from '../teams.service';

@Injectable()
export class IsUniqueNameMiddleware implements NestMiddleware {
    constructor(private readonly teamsService: TeamsService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const name = req.body.name;

            const isExistTeamWithThisName = await this.teamsService.isExistsTeamName(name);
            if(isExistTeamWithThisName) {
                next(new HttpException('Team with this name already exists', HttpStatus.BAD_REQUEST));
            } else {
                next();
            }
        } catch (e) {
            if(e instanceof HttpException)
                throw e;
            else
                throw new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
