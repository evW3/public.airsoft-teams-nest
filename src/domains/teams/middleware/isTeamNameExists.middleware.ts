import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { TeamsService } from '../teams.service';

@Injectable()
export class IsTeamNameExistsMiddleware implements NestMiddleware {
    constructor(private readonly teamsService: TeamsService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const name = req.body.teamName;
            const isTeamWithThisNameExists = await this.teamsService.isExistsTeam(name);

            if(!isTeamWithThisNameExists) {
                next(new HttpException('Team with this name doesn`t exists', HttpStatus.BAD_REQUEST));
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
