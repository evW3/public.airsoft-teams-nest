import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CreateRole } from '../../decorators/roles.decorator';
import { queryTypes, statuses, userRoles } from '../../utils/enums';
import { RolesGuard } from '../../guards/role.guard';
import { TransportPlayerQueryDto } from './dto/transportPlayerQuery.dto';
import { QueriesService } from '../queries/queries.service';
import { getManager } from 'typeorm';
import { Users } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { TeamsService } from '../teams/teams.service';
import { TransportExcludeFromTeamDto } from './dto/transportExcludeFromTeam.dto';
import { BlockList } from '../blockList/blockList.model';
import { BlockListService } from '../blockList/blockList.service';
import { TransportPlayerDto } from './dto/transportPlayer.dto';
import { CreateQuery } from '../queries/decorators/query.decorator';
import { IsQueryExistsGuard } from './guards/isQueryExists.guard';
import { SMTPService } from '../users/SMTP.service';
import { SchemaValidate } from '../../pipes/schemaValidate';
import { PlayerQuerySchema } from './schemas/playerquery.schema';
import { ExcludeFromTeam } from './schemas/excludeFromTeam.schema';
import { PlayerSchema } from './schemas/player.schema';

@Controller('players')
export class PlayersController {
    constructor(
        private readonly queriesService: QueriesService,
        private readonly usersService: UsersService,
        private readonly teamsService: TeamsService,
        private readonly blockListService: BlockListService,
        private readonly smtpService: SMTPService) {}

    @Patch('/accept-join-team')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @CreateQuery(queryTypes.JOIN_TEAM)
    @UseGuards(RolesGuard, IsQueryExistsGuard)
    @UsePipes(new SchemaValidate(PlayerQuerySchema))
    async acceptJoinTeam(@Body() transportPlayerQueryDto: TransportPlayerQueryDto) {
        const queryEntity = await this.queriesService.getQuery(transportPlayerQueryDto.queryId);
        const teamName = JSON.parse(queryEntity.queryParams.parameter).teamName;
        const teamEntity = await this.teamsService.getTeamByName(teamName);
        const userId = await this.queriesService.getUserIdByQueryId(transportPlayerQueryDto.queryId);
        const userEntity = await getManager().findOne(Users, userId);

        userEntity.team = teamEntity;
        queryEntity.status = statuses.ACCEPTED;

        await Promise.all([
            this.usersService.save(userEntity),
            this.queriesService.saveQuery(queryEntity)
        ]);

        return { message: 'User added to team', status: HttpStatus.OK };
    }

    @Patch('/decline-join-team')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @CreateQuery(queryTypes.JOIN_TEAM)
    @UseGuards(RolesGuard, IsQueryExistsGuard)
    @UsePipes(new SchemaValidate(PlayerQuerySchema))
    async declineJoinTeam(@Body() transportPlayerQueryDto: TransportPlayerQueryDto) {
        const queryEntity = await this.queriesService.getQuery(transportPlayerQueryDto.queryId);
        queryEntity.status = statuses.DECLINE;

        await this.queriesService.saveQuery(queryEntity);

        return { message: 'User query was declined', status: HttpStatus.OK };
    }

    @Patch('/accept-exit-team')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @CreateQuery(queryTypes.EXIT_FROM_TEAM)
    @UseGuards(RolesGuard, IsQueryExistsGuard)
    @UsePipes(new SchemaValidate(PlayerQuerySchema))
    async acceptExitTeam(@Body() transportPlayerQueryDto: TransportPlayerQueryDto) {
        const queryEntity = await this.queriesService.getQuery(transportPlayerQueryDto.queryId);
        const userId = await this.queriesService.getUserIdByQueryId(transportPlayerQueryDto.queryId);

        const userEntity = await getManager().findOne(Users, userId);

        userEntity.team = null;
        queryEntity.status = statuses.ACCEPTED;

        await Promise.all([
            this.usersService.save(userEntity),
            this.queriesService.saveQuery(queryEntity)
        ]);

        return { message: 'Player exit from team', status: HttpStatus.OK };
    }

    @Patch('/decline-exit-team')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @CreateQuery(queryTypes.EXIT_FROM_TEAM)
    @UseGuards(RolesGuard, IsQueryExistsGuard)
    @UsePipes(new SchemaValidate(PlayerQuerySchema))
    async declineExitTeam(@Body() transportPlayerQueryDto: TransportPlayerQueryDto) {
        const queryEntity = await this.queriesService.getQuery(transportPlayerQueryDto.queryId);

        queryEntity.status = statuses.DECLINE;

        await this.queriesService.saveQuery(queryEntity)

        return { message: 'Player query was declined', status: HttpStatus.OK };
    }

    @Patch('/exclude-from-team')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @UseGuards(RolesGuard)
    @UsePipes(new SchemaValidate(ExcludeFromTeam))
    async excludeFromTeam(@Body() transportExcludeFromTeam: TransportExcludeFromTeamDto) {
        const userEntity = await getManager().findOne(Users, transportExcludeFromTeam.userId);
        userEntity.team = null;
        await this.usersService.save(userEntity);

        return { message: 'Player was excluded', status: HttpStatus.OK }
    }

    @Get('/:id')
    async getPlayer(@Param('id') id: number) {
        return await this.usersService.getUser(id);
    }

    @Post('/block')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @UseGuards(RolesGuard)
    @UsePipes(new SchemaValidate(PlayerSchema))
    async blockPlayer(@Body() transportPlayer: TransportPlayerDto) {
        const userEntity = await getManager().findOne(Users, transportPlayer.playerId);
        const blockEntity = new BlockList();

        blockEntity.description = transportPlayer.description;
        blockEntity.user = userEntity;

        await this.blockListService.block(blockEntity);

        this.smtpService.sendMail(transportPlayer.description, 'Blocked account', userEntity.email);

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
                    blockList: 'user.blockList'
                }
            }
        });

        await this.blockListService.unblock(userEntity.blockList);

        this.smtpService.sendMail(transportPlayer.description, 'Unblocked account', userEntity.email);

        return { message: 'Player was unblocked', status: HttpStatus.OK };
    }
}

