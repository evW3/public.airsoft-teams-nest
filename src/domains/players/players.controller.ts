import { Body, Controller, Delete, Get, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateRole } from '../../decorators/roles.decorator';
import { statuses, userRoles } from '../../utils/enums';
import { RolesGuard } from '../../guards/role.guard';
import { QueriesService } from '../queries/queries.service';
import { TransportQueryDto } from './dto/transportQuery.dto';
import { getManager } from 'typeorm';
import { Queries } from '../queries/queries.model';
import { RolesService } from '../roles/roles.service';
import { Users } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { Roles } from '../roles/roles.model';
import { TransportPlayer } from './dto/transportPlayer';
import { BlockListService } from '../blockList/blockList.service';
import { BlockList } from '../blockList/blockList.model';

@Controller('players')
export class PlayersController {
    constructor(private readonly queriesService: QueriesService,
                private readonly rolesService: RolesService,
                private readonly usersService: UsersService,
                private readonly blockListService: BlockListService) {}

    @Patch('/decline-change-role')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @UseGuards(RolesGuard)
    async declineChangeRole(@Body() transportQueryDto: TransportQueryDto) {
        const queryEntity = await getManager().findOne(Queries, transportQueryDto.queryId);
        queryEntity.status = statuses.DECLINE;
        await this.queriesService.saveQuery(queryEntity);
        return { message: 'Player query was declined', status: HttpStatus.OK };
    }

    @Patch('/accept-change-role')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @UseGuards(RolesGuard)
    async acceptChangeRole(@Body() transportQueryDto: TransportQueryDto) {
        const queryEntity = await getManager().findOne(Queries, transportQueryDto.queryId);
        const roleId = await this.rolesService.getRoleIdByName(userRoles.MANAGER);
        const rolesEntity = await getManager().findOne(Roles, roleId);
        const userId = await this.queriesService.getUserIdByQueryId(transportQueryDto.queryId);
        const userEntity = await getManager().findOne(Users, userId);
        userEntity.role = rolesEntity;
        queryEntity.status = statuses.ACCEPTED;
        await Promise.all([
            this.queriesService.saveQuery(queryEntity),
            this.usersService.save(userEntity)
        ]);
        return { message: 'Player role changed successfully', status: HttpStatus.OK };
    }

    @Get('/:id')
    async getPlayer(@Body() transportPlayer: TransportPlayer) {
        return await this.usersService.getUser(transportPlayer.playerId);
    }

    @Post('/block')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @UseGuards(RolesGuard)
    async blockPlayer(@Body() transportPlayer: TransportPlayer) {
        const userEntity = await getManager().findOne(Users, transportPlayer.playerId);
        const blockEntity = new BlockList();
        blockEntity.description = transportPlayer.description;
        blockEntity.user = userEntity;
        await this.blockListService.block(blockEntity);
        return { message: 'Player was blocked', status: HttpStatus.OK };
    }

    @Delete('/unblock')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @UseGuards(RolesGuard)
    async unblockPlayer(@Body() transportPlayer: TransportPlayer) {
        const userEntity = await getManager().findOne(Users, transportPlayer.playerId);
        await this.blockListService.unblock(userEntity.blockList);
        return { message: 'Player was unblocked', status: HttpStatus.OK };
    }
}

