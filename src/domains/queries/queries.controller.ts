import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { TransportIdDto } from '../users/dto/transportId.dto';
import { Queries } from './queries.model';
import { getManager } from 'typeorm';
import { Users } from '../users/users.model';
import { queryTypes, statuses, userRoles } from '../../utils/enums';
import { CreateRole } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/role.guard';
import { CreateQuery } from './decorators/query.decorator';
import { IsQueryUnique } from './guards/isQueryUnique';

@Controller('queries')
export class QueriesController {
    constructor(private readonly queriesService: QueriesService) {}

    @Get('/')
    @CreateRole(userRoles.MANAGER, userRoles.ADMIN)
    @UseGuards(RolesGuard)
    async getQueries() {
        return await this.queriesService.getAllQueries();
    }

    @Post('/change-role')
    @CreateRole(userRoles.PLAYER)
    @CreateQuery(queryTypes.CHANGE_ROLE)
    @UseGuards(RolesGuard, IsQueryUnique)
    async createChangeRoleQuery(@Body() transportId: TransportIdDto) {
        const queryEntity = new Queries();
        const userEntity = await getManager().findOne(Users, transportId.id);

        queryEntity.user = userEntity;
        queryEntity.type = queryTypes.CHANGE_ROLE;
        queryEntity.status = statuses.PROCESSED;

        await this.queriesService.saveQuery(queryEntity);
        return { message: 'Change role query successfully created', status: HttpStatus.CREATED };
    }

    @Post('/join-team')
    @CreateRole(userRoles.PLAYER)
    @CreateQuery(queryTypes.JOIN_TEAM)
    @UseGuards(RolesGuard, IsQueryUnique)
    async createJoinTeamQuery(@Body() transportId: TransportIdDto) {
        const queryEntity = new Queries();
        const userEntity = await getManager().findOne(Users, transportId.id);

        queryEntity.user = userEntity;
        queryEntity.type = queryTypes.JOIN_TEAM;
        queryEntity.status = statuses.PROCESSED;

        await this.queriesService.saveQuery(queryEntity);
        return { message: 'Join team query successfully created', status: HttpStatus.CREATED };
    }

    @Post('/exit-team')
    @CreateRole(userRoles.PLAYER)
    @CreateQuery(queryTypes.EXIT_FROM_TEAM)
    @UseGuards(RolesGuard, IsQueryUnique)
    async createExitTeamQuery(@Body() transportId: TransportIdDto) {
        const queryEntity = new Queries();
        const userEntity = await getManager().findOne(Users, transportId.id);

        queryEntity.user = userEntity;
        queryEntity.type = queryTypes.EXIT_FROM_TEAM;
        queryEntity.status = statuses.PROCESSED;

        await this.queriesService.saveQuery(queryEntity);
        return { message: 'Exit team query successfully created', status: HttpStatus.CREATED };
    }


}