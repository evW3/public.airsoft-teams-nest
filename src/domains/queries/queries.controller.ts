import { Body, Controller, Get, HttpStatus, Post, UseGuards, UsePipes } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { TransportIdDto } from '../users/dto/transportId.dto';
import { Queries } from './queries.model';
import { getManager } from 'typeorm';
import { Users } from '../users/users.model';
import { queryTypes, statuses, userRoles } from '../../utils/enums';
import { CreateRole } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/role.guard';
import { CreateQuery } from './decorators/query.decorator';
import { IsQueryUniqueGuard } from './guards/isQueryUnique.guard';
import { TransportCreateJoinTeamDto } from './dto/transportCreateJoinTeam.dto';
import { QueryParams } from './queryParams.model';
import { QueryParamsService } from './queryParams.service';
import { SchemaValidate } from '../../pipes/schemaValidate';
import { CreateJoinQuerySchema } from './schemas/createJoinQuery.schema';

@Controller('queries')
export class QueriesController {
    constructor(private readonly queriesService: QueriesService,
                private readonly queryParamsService: QueryParamsService) {}

    @Get('/')
    @CreateRole(userRoles.MANAGER, userRoles.ADMIN)
    @UseGuards(RolesGuard)
    async getQueries() {
        return await this.queriesService.getAllQueries();
    }

    @Post('/change-role')
    @CreateRole(userRoles.PLAYER)
    @CreateQuery(queryTypes.CHANGE_ROLE)
    @UseGuards(RolesGuard, IsQueryUniqueGuard)
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
    @UseGuards(RolesGuard, IsQueryUniqueGuard)
    @UsePipes(new SchemaValidate(CreateJoinQuerySchema))
    async createJoinTeamQuery(@Body() transportCreateJoinTeamDto: TransportCreateJoinTeamDto) {
        const queryEntity = new Queries();
        const queryParamsEntity = new QueryParams();
        const userEntity = await getManager().findOne(Users, transportCreateJoinTeamDto.id);

        queryEntity.user = userEntity;
        queryEntity.type = queryTypes.JOIN_TEAM;
        queryEntity.status = statuses.PROCESSED;

        queryParamsEntity.parameter = JSON.stringify({teamName: transportCreateJoinTeamDto.teamName});
        queryParamsEntity.query = queryEntity;

        await Promise.all([
            this.queriesService.saveQuery(queryEntity),
            this.queryParamsService.saveQueryParams(queryParamsEntity)
        ]);

        return { message: 'Join team query successfully created', status: HttpStatus.CREATED };
    }

    @Post('/exit-team')
    @CreateRole(userRoles.PLAYER)
    @CreateQuery(queryTypes.EXIT_FROM_TEAM)
    @UseGuards(RolesGuard, IsQueryUniqueGuard)
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