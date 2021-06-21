import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockListService } from './blockList.service';
import { BlockList } from './blockList.model';

@Module({
    imports: [TypeOrmModule.forFeature([BlockList])],
    providers: [BlockListService],
    exports: [BlockListService]
})
export class BlockListModule {}