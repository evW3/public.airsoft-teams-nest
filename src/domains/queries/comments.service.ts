import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from './comments.model';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
    constructor(@InjectRepository(Comments) private readonly commentsRepository: Repository<Comments>) {}

    async saveComment(comment: Comments) {
        await this.commentsRepository.save(comment);
    }
}