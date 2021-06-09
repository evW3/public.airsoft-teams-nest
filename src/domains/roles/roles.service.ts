import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './roles.model';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
    constructor(@InjectRepository(Roles) private rolesRepository: Repository<Roles>) {}

    async getRoleIdByName(name: string): Promise<number> {
        const roleId = await this.rolesRepository.findOne({ where: { name }, select: ['id'] });
        return roleId.id;
    }
}