import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.model';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

    async create(createUserDto: CreateUserDto) {
        const user = this.usersRepository.create(createUserDto);
        return user;
    }

    async getUserByEmail(email: string): Promise<Users> {
        const user = await this.usersRepository.findOne({ where: { email } });
        return user;
    }

    async isUserEmailUnique(email: string): Promise<boolean> {
        const count = await this.usersRepository.count({ where: { email } });
        return count === 0;
    }
}