import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Teams } from './teams.model';
import { Users } from '../users/users.model';

@Injectable()
export class TeamsService {
    constructor(@InjectRepository(Teams) private teamsRepository: Repository<Teams> ) {}

    async save(team: Teams): Promise<Teams> {
        return await this.teamsRepository.save(team);
    }

    async isExistsTeam(id: number): Promise<boolean> {
        const count = await this.teamsRepository.count({ where: {id} });
        return count === 1;
    }

    async isExistsTeamName(name: string): Promise<boolean> {
        const count = await this.teamsRepository.count({ where: {name} });
        return count === 1;
    }

    async getTeamMembers(id: number): Promise<Users[]> {
        const team = await this.teamsRepository.findOne({
            where: { id },
            join: {
                alias: 'team',
                leftJoinAndSelect: {
                    queries: "team.users"
                }
            }
        });
        return team.users;
    }

}