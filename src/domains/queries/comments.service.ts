import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comments } from './comments.model';

@Injectable()
export class CommentsService {
    constructor(@InjectRepository(Comments) private readonly commentsRepository: Repository<Comments>) {}

    async saveComment(comment: Comments) {
        await this.commentsRepository.save(comment);
    }
}