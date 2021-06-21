import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryParams } from './queryParams.model';

@Injectable()
export class QueryParamsService {
    constructor(@InjectRepository(QueryParams) private readonly queryParamsRepository: Repository<QueryParams>) {}

    async saveQueryParams(params: QueryParams): Promise<void> {
        await this.queryParamsRepository.save(params);
    }
}