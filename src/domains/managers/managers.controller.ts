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

import { CreateRole } from '../../decorators/roles.decorator';
import { queryTypes, statuses, userRoles } from '../../utils/enums';
import { RolesGuard } from '../../guards/role.guard';
import { QueriesService } from '../queries/queries.service';
import { TransportQueryDto } from './dto/transportQuery.dto';
import { getManager } from 'typeorm';
import { Queries } from '../queries/queries.model';
import { RolesService } from '../roles/roles.service';
import { Users } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { Roles } from '../roles/roles.model';
import { TransportManagersDto } from './dto/transportManagers.dto';
import { BlockListService } from '../blockList/blockList.service';
import { CommentsService } from '../queries/comments.service';
import { Comments } from '../queries/comments.model';
import { CreateQuery } from '../queries/decorators/query.decorator';
import { IsQueryExistsGuard } from '../players/guards/isQueryExists.guard';
import { SchemaValidate } from '../../pipes/schemaValidate';
import { ManagersSchema } from './schemas/managers.schema';
import { ExcludePassword } from '../../interceptors/response';

@Controller('managers')
@UseInterceptors(ExcludePassword)
export class ManagersController {
    constructor(private readonly queriesService: QueriesService,
                private readonly rolesService: RolesService,
                private readonly usersService: UsersService,
                private readonly blockListService: BlockListService,
                private readonly commentsService: CommentsService) {}

    @Patch('/decline-change-role')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @CreateQuery(queryTypes.CHANGE_ROLE)
    @UseGuards(RolesGuard, IsQueryExistsGuard)
    async declineChangeRole(@Body() transportQueryDto: TransportQueryDto) {
        const queryEntity = await getManager().findOne(Queries, transportQueryDto.queryId);
        const commentsEntity = new Comments();
        queryEntity.status = statuses.DECLINE;

        commentsEntity.description = transportQueryDto.description;
        commentsEntity.query = queryEntity;

        await Promise.all([
            this.queriesService.saveQuery(queryEntity),
            this.commentsService.saveComment(commentsEntity)
        ]);

        return { message: 'Player query was declined', status: HttpStatus.OK };
    }

    @Patch('/accept-change-role')
    @CreateRole(userRoles.ADMIN, userRoles.MANAGER)
    @CreateQuery(queryTypes.CHANGE_ROLE)
    @UseGuards(RolesGuard, IsQueryExistsGuard)
    async acceptChangeRole(@Body() transportQueryDto: TransportQueryDto) {
        const queryEntity = await getManager().findOne(Queries, transportQueryDto.queryId);
        const roleId = await this.rolesService.getRoleIdByName(userRoles.MANAGER);
        const rolesEntity = await getManager().findOne(Roles, roleId);
        const userId = await this.queriesService.getUserIdByQueryId(transportQueryDto.queryId);
        const userEntity = await getManager().findOne(Users, userId);

        userEntity.role = rolesEntity;
        queryEntity.status = statuses.ACCEPTED;

        await this.queriesService.saveQuery(queryEntity);

        return await this.usersService.save(userEntity);
    }

    @Get('/:id')
    async getPlayer(@Param('id') id: number) {
        return await this.usersService.getUser(id);
    }

    @Post('/block')
    @CreateRole(userRoles.ADMIN)
    @UseGuards(RolesGuard)
    @UsePipes(new SchemaValidate(ManagersSchema))
    async blockPlayer(@Body() transportPlayer: TransportManagersDto) {
        const userEntity = await getManager().findOne(Users, transportPlayer.managerId, {
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    role: 'user.role'
                }
            }
        });

        if(userEntity.role.name !== userRoles.MANAGER) {
            throw new HttpException('Can`t find manager', HttpStatus.BAD_REQUEST);
        }

        await this.usersService.blockUser(userEntity, transportPlayer.description);

        return { message: 'Manager was blocked', status: HttpStatus.OK };
    }

    @Delete('/unblock')
    @CreateRole(userRoles.ADMIN)
    @UseGuards(RolesGuard)
    @UsePipes(new SchemaValidate(ManagersSchema))
    async unblockPlayer(@Body() transportPlayer: TransportManagersDto) {
        const userEntity = await getManager().findOne(Users, transportPlayer.managerId, {
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    role: 'user.role',
                    blockList: 'user.blockList'
                }
            }
        });

        if(userEntity.role.name !== userRoles.MANAGER) {
            throw new HttpException('Can`t find manager', HttpStatus.BAD_REQUEST);
        }

        await this.usersService.unblockUser(userEntity, transportPlayer.description);

        return { message: 'Manager was unblocked', status: HttpStatus.OK };
    }
}

