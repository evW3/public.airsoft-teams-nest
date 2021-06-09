import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './roles.model';

@Module({
    imports: [TypeOrmModule.forFeature([Roles])],
    providers: [RolesService],
    exports: [RolesService]
})
export class RolesModule {}
