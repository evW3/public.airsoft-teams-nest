import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from './users.model';
import { Queries } from '../queries/queries.model';
import { BlockList } from '../blockList/blockList.model';
import { BlockListService } from '../blockList/blockList.service';
import { SMTPService } from './SMTP.service';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private usersRepository: Repository<Users>,
                private readonly blockListService: BlockListService,
                private readonly smtpService: SMTPService) {}

    async save(user: Users): Promise<Users> {
        return await this.usersRepository.save(user);
    }

    async getUserByEmail(email: string): Promise<Users> {
        const user = await this.usersRepository.findOne({ where: { email } });
        return user;
    }

    async getUserIdByEmail(email: string): Promise<number> {
        const user = await this.usersRepository.findOne({ where: { email }, select: ['id'] });
        return user.id;
    }

    async isUserEmailUnique(email: string): Promise<boolean> {
        const count = await this.usersRepository.count({ where: { email } });
        return count === 0;
    }

    async validateUser(id: number, password: string): Promise<boolean> {
        const count = await this.usersRepository.count({ where: { id, password } });
        return count === 1;
    }

    async getUserSalt(id: number): Promise<string> {
        const user = await this.usersRepository.findOne({ where: { id }, select: ['password_salt'] });
        return user.password_salt;
    }

    async isExistsEmail(email: string): Promise<boolean> {
        const count = await this.usersRepository.count({ where: { email } });
        return count === 1;
    }

    async getUser(id: number): Promise<Users> {
        return await this.usersRepository.findOne({
            where: { id },
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    role: "user.role",
                    team: "user.team"
                }
            }
        });
    }

    async getUserRole(id: number): Promise<string> {
        const user = await this.usersRepository.findOne({
            where: {id},
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    role: "user.role",
                }
            }
         });
        return user.role.name;
    }

    async getUserQueries(id: number): Promise<Queries[]> {
        const user = await this.usersRepository.findOne({
            where: {id},
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    queries: "user.queries",
                }
            }
        });
        return user.queries;
    }

    async isUserInBlockList(id: number): Promise<boolean> {
        const user = await this.usersRepository.findOne({
            where: {id},
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    blockList: "user.blockList",
                }
            }
        });
        return !!user.blockList;
    }

    async isUserHaveTeam(id: number): Promise<boolean> {
        const user = await this.usersRepository.findOne({
            where: {id},
            join: {
                alias: 'user',
                leftJoinAndSelect: {
                    team: 'user.team'
                }
            }
        });
        return !!user.team;
    }

    async blockUser(userEntity: Users, description: string): Promise<void> {
        const blockEntity = new BlockList();

        blockEntity.description = description;
        blockEntity.user = userEntity;

        await this.blockListService.block(blockEntity);

        this.smtpService.sendMail(description, 'Blocked account', userEntity.email);
    }

    async unblockUser(userEntity: Users, description: string): Promise<void> {
        await this.blockListService.unblock(userEntity.blockList);

        this.smtpService.sendMail(description, 'Unblocked account', userEntity.email);
    }
}