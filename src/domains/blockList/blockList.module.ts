import { Module } from '@nestjs/common';
import { BlockListService } from './blockList.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockList } from './blockList.model';

@Module({
    imports: [TypeOrmModule.forFeature([BlockList])],
    providers: [BlockListService],
    exports: [BlockListService]
})
export class BlockListModule {}