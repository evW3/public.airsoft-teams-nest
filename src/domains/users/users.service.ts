import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.model';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

    async create(createUserDto: CreateUserDto) {
        return this.usersRepository.create(createUserDto);
    }

    async getUserByEmail(email: string) {
        const user = await this.usersRepository.findOne({ where: { email } });
        return user;
    }
}