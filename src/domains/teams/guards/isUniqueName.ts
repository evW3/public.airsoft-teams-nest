import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

import { TeamsService } from '../teams.service';

@Injectable()
export class IsUniqueName implements CanActivate {
    constructor(private readonly teamsService: TeamsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const req = context.switchToHttp().getRequest();
            const name = req.body.name;

            const isExistTeamWithThisName = await this.teamsService.isExistsTeam(name);
            if(isExistTeamWithThisName) {
                throw new HttpException('Team with this name already exists', HttpStatus.BAD_REQUEST);
            } else {
                return true;
            }
        } catch (e) {
            if(e instanceof HttpException)
                throw e;
            else
                throw new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}