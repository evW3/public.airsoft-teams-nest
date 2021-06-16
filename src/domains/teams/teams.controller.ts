import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { TransportCreateTeamDto } from './dto/transportCreateTeam.dto';
import { TeamsService } from './teams.service';
import { Teams } from './teams.model';
import { CreateRole } from '../../decorators/roles.decorator';
import { userRoles } from '../../utils/enums';
import { RolesGuard } from '../../guards/role.guard';
import { SchemaValidate } from '../../pipes/schemaValidate';
import { CreateTeamSchema } from './schemas/createTeam.schema';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}

    @Post('/')
    @CreateRole(userRoles.ADMIN)
    @UseGuards(RolesGuard)
    @UsePipes(new SchemaValidate(CreateTeamSchema))
    async createTeam(@Body() transportCreateTeamDto: TransportCreateTeamDto) {
        const teamEntity = new Teams();
        teamEntity.name = transportCreateTeamDto.name;
        await this.teamsService.save(teamEntity);
        return { message: 'Team created', status: HttpStatus.CREATED };
    }

    @Get('/:id')
    async getTeamMembers(@Param('id') id: number) {
        return await this.teamsService.getTeamMembers(id);
    }
}