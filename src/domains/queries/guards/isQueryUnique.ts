import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { QUERY_KEY } from '../../../constants';
import { statuses } from '../../../utils/enums';


@Injectable()
export class IsQueryUnique implements CanActivate {
    constructor(private readonly usersService: UsersService,
                private readonly reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const typeQuery = this.reflector.getAllAndOverride(QUERY_KEY, [
                context.getHandler(),
                context.getClass()
            ]);

            if(typeQuery) {
                const req = context.switchToHttp().getRequest();
                const userId = req.body.id;
                const queries = await this.usersService.getUserQueries(userId);
                if(queries) {
                    for(let query of queries) {
                        if(query.type === typeQuery && query.status === statuses.PROCESSED) {
                            return false;
                        }
                    }
                }
                return true;
            }

            return false;
        } catch (e) {
            if(e instanceof HttpException)
                throw e;
            else
                throw new HttpException('Server error!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}