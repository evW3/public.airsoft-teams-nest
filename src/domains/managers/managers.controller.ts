import { Body, Controller, Delete, Get, HttpStatus, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { getManager } from 'typeorm';

import { CreateRole } from '../../decorators/roles.decorator';
import { userRoles } from '../../utils/enums';
import { RolesGuard } from '../../guards/role.guard';
import { QueriesService } from '../queries/queries.service';
import { RolesService } from '../roles/roles.service';
import { Users } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { TransportManagersDto } from './dto/transportManagers.dto';
import { BlockListService } from '../blockList/blockList.service';
import { BlockList } from '../blockList/blockList.model';
import { SMTPService } from '../users/SMTP.service';
import { SchemaValidate } from '../../pipes/schemaValidate';
import { ManagersSchema } from './schemas/managers.schema';

@Controller('managers')
export class ManagersController {
    constructor(private readonly usersService: UsersService,
                private readonly blockListService: BlockListService,
                private readonly smtpService: SMTPService) {}

    @Get('/:id')
    async getPlayer(@Param('id') id: number) {
        return await this.usersService.getUser(id);
    }

    @Post('/block')
    @CreateRole(userRoles.ADMIN)
    @UseGuards(RolesGuard)
    @UsePipes(new SchemaValidate(ManagersSchema))
    async blockPlayer(@Body() transportPlayer: TransportManagersDto) {
        const userEntity = await getManager().findOne(Users, transportPlayer.managerId);
        const blockEntity = new BlockList();

        blockEntity.description = transportPlayer.description;
        blockEntity.user = userEntity;

        await this.blockListService.block(blockEntity);

        this.smtpService.sendMail(transportPlayer.description, 'Blocked account', userEntity.email);

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
                    blockList: 'user.blockList'
                }
            }
        });

        await this.blockListService.unblock(userEntity.blockList);

        this.smtpService.sendMail(transportPlayer.description, 'Unblocked account', userEntity.email);

        return { message: 'Manager was unblocked', status: HttpStatus.OK };
    }
}

