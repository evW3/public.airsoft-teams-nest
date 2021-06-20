import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { QUERY_KEY } from '../../../constants';
import { statuses } from '../../../utils/enums';
import { QueriesService } from '../../queries/queries.service';


@Injectable()
export class IsQueryExistsGuard implements CanActivate {
    constructor(private readonly queriesService: QueriesService,
                private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const typeQuery = this.reflector.getAllAndOverride(QUERY_KEY, [
                context.getHandler(),
                context.getClass()
            ]);

            if(typeQuery) {
                const req = context.switchToHttp().getRequest();
                const queryId = req.body.queryId;
                const queryEntity = await this.queriesService.getQuery(queryId);

                return queryEntity && queryEntity.type === typeQuery && queryEntity.status === statuses.PROCESSED;
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