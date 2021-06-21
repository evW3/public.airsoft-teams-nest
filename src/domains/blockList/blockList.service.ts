import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BlockList } from './blockList.model';
import { Repository } from 'typeorm';

@Injectable()
export class BlockListService {
    constructor(@InjectRepository(BlockList) private readonly blockListRepository: Repository<BlockList>) {}

    async block(blockEntity: BlockList): Promise<void> {
        await this.blockListRepository.save(blockEntity);
    }

    async unblock(blockEntity: BlockList): Promise<void> {
        await this.blockListRepository.remove(blockEntity);
    }
}