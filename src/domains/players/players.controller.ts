import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    UseGuards, UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { getManager } from 'typeorm';

import { CreateRole } from '../../decorators/roles.decorator';
import { queryTypes, statuses, userRoles } from '../../utils/enums';
import { RolesGuard } from '../../guards/role.guard';
import { TransportPlayerQueryDto } from './dto/transportPlayerQuery.dto';
import { QueriesService } from '../queries/queries.service';
import { Users } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { TransportExcludeFromTeamDto } from './dto/transportExcludeFromTeam.dto';
import { TransportPlayerDto } from './dto/transportPlayer.dto';
import { CreateQuery } from '../queries/decorators/query.decorator';
import { IsQueryExistsGuard } from './guards/isQueryExists.guard';
import { SchemaValidate } from '../../pipes/schemaValidate';
import { PlayerQuerySchema } from './schemas/playerquery.schema';
import { ExcludeFromTeam } from './schemas/excludeFromTeam.schema';
import { PlayerSchema } from './schemas/player.schema';
import { Teams } from '../teams/teams.model';
import { ExcludePassword } from '../../interceptors/response';

@Controller('players')
@UseInterceptors(ExcludePassword)
export class PlayersController {
    constructor(
        private readonly queriesService: QueriesService,
        private readonly usersService: UsersService) {}

    @Patch('/accept-join-team')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @CreateQuery(queryTypes.JOIN_TEAM)
    @UseGuards(RolesGuard, IsQueryExistsGuard)
    @UsePipes(new SchemaValidate(PlayerQuerySchema))
    async acceptJoinTeam(@Body() transportPlayerQueryDto: TransportPlayerQueryDto) {
        const queryEntity = await this.queriesService.getQuery(transportPlayerQueryDto.queryId);
        const teamId = JSON.parse(queryEntity.queryParams.parameter).teamId;
        const teamEntity = await getManager().findOne(Teams, teamId);
        const userId = await this.queriesService.getUserIdByQueryId(transportPlayerQueryDto.queryId);
        const userEntity = await getManager().findOne(Users, userId);

        userEntity.team = teamEntity;
        queryEntity.status = statuses.ACCEPTED;

        await this.usersService.save(userEntity)


        return await this.queriesService.saveQuery(queryEntity);
    }

    @Patch('/decline-join-team')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @CreateQuery(queryTypes.JOIN_TEAM)
    @UseGuards(RolesGuard, IsQueryExistsGuard)
    @UsePipes(new SchemaValidate(PlayerQuerySchema))
    async declineJoinTeam(@Body() transportPlayerQueryDto: TransportPlayerQueryDto) {
        const queryEntity = await this.queriesService.getQuery(transportPlayerQueryDto.queryId);
        queryEntity.status = statuses.DECLINE;

        return await this.queriesService.saveQuery(queryEntity);
    }

    @Patch('/accept-exit-team')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @CreateQuery(queryTypes.EXIT_FROM_TEAM)
    @UseGuards(RolesGuard, IsQueryExistsGuard)
    @UsePipes(new SchemaValidate(PlayerQuerySchema))
    async acceptExitTeam(@Body() transportPlayerQueryDto: TransportPlayerQueryDto) {
        try {
            const queryEntity = await this.queriesService.getQuery(transportPlayerQueryDto.queryId);
            const userId = await this.queriesService.getUserIdByQueryId(transportPlayerQueryDto.queryId);

            const userEntity = await getManager().findOne(Users, userId);

            userEntity.team = null;
            queryEntity.status = statuses.ACCEPTED;

            await this.usersService.save(userEntity);

            return await this.queriesService.saveQuery(queryEntity)
        } catch (e) {
            console.log(e);
        }
    }

    @Patch('/decline-exit-team')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @CreateQuery(queryTypes.EXIT_FROM_TEAM)
    @UseGuards(RolesGuard, IsQueryExistsGuard)
    @UsePipes(new SchemaValidate(PlayerQuerySchema))
    async declineExitTeam(@Body() transportPlayerQueryDto: TransportPlayerQueryDto) {
        const queryEntity = await this.queriesService.getQuery(transportPlayerQueryDto.queryId);

        queryEntity.status = statuses.DECLINE;

        return await this.queriesService.saveQuery(queryEntity);
    }

    @Patch('/exclude-from-team')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @UseGuards(RolesGuard, IsQueryExistsGuard)
    @UsePipes(new SchemaValidate(ExcludeFromTeam))
    async excludeFromTeam(@Body() transportExcludeFromTeam: TransportExcludeFromTeamDto) {
        const userEntity = await getManager().findOne(Users, transportExcludeFromTeam.userId);
        userEntity.team = null;

        return await this.usersService.save(userEntity);
    }

    @Get('/:id')
    async getPlayer(@Param('id') id: number) {
        const userEntity = await this.usersService.getUser(id);

        if(userEntity.role.name !== userRoles.PLAYER) {
            throw new HttpException('Can`t find player', HttpStatus.BAD_REQUEST);
        }

        return userEntity;
    }

    @Post('/block')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @UseGuards(RolesGuard)
    @UsePipes(new SchemaValidate(PlayerSchema))
    async blockPlayer(@Body() transportPlayer: TransportPlayerDto) {
        const userEntity = await getManager().findOne(Users, transportPlayer.playerId, {
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    role: 'user.role'
                }
            }
        });

        console.log(userEntity);

        if(userEntity.role.name !== userRoles.PLAYER) {
            throw new HttpException('Can`t find manager', HttpStatus.BAD_REQUEST);
        }

        await this.usersService.blockUser(userEntity, transportPlayer.description);

        return { message: 'Player was blocked', status: HttpStatus.OK };
    }

    @Delete('/unblock')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @UseGuards(RolesGuard)
    @UsePipes(new SchemaValidate(PlayerSchema))
    async unblockPlayer(@Body() transportPlayer: TransportPlayerDto) {
        const userEntity = await getManager().findOne(Users, transportPlayer.playerId, {
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    role: 'user.role',
                    blockList: 'user.blockList'
                }
            }
        });

        if(userEntity.role.name !== userRoles.PLAYER) {
            throw new HttpException('Can`t find manager', HttpStatus.BAD_REQUEST);
        }

        await this.usersService.unblockUser(userEntity, transportPlayer.description);

        return { message: 'Player was unblocked', status: HttpStatus.OK };
    }
}

