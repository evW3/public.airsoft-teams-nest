import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.model';

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
