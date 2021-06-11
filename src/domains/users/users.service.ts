import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from './users.model';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

    async create(user: Users) {
        const userEntity = await this.usersRepository.save(user);
        return userEntity.id;
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

    async isUserHasCode(userId: number, codeId: number) {
        const user = await this.usersRepository.count(
            {
                where: { id: userId },
                join: {
                    alias: 'code',
                    leftJoin: {
                        id: 'users.verification_codes'
                    }
                }
        });
        console.log(user);
    }

    async isExistsEmail(email: string): Promise<boolean> {
        const count = await this.usersRepository.count({ where: { email } });
        return count === 1;
    }

    async changeUserPassword(user: Users): Promise<void> {
        await this.usersRepository.save(user);
    }
}