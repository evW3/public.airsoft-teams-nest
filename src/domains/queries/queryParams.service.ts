import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryParams } from './queryParams.model';
import { Repository } from 'typeorm';

@Injectable()
export class QueryParamsService {
    constructor(@InjectRepository(QueryParams) private readonly queryParamsRepository: Repository<QueryParams>) {}

    async saveQueryParams(params: QueryParams): Promise<void> {
        await this.queryParamsRepository.save(params);
    }
}