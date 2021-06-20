import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queries } from './queries.model';

@Injectable()
export class QueriesService {
    constructor(@InjectRepository(Queries) private queriesRepository: Repository<Queries>) {}

    async getAllQueries(): Promise<Queries[]> {
        return await this.queriesRepository.find();
    }

    async saveQuery(query: Queries): Promise<Queries> {
        return await this.queriesRepository.save(query);
    }

    async getUserIdByQueryId(queryId: number): Promise<number> {
        const query = await this.queriesRepository.findOne({
            where: {id: queryId},
            join: {
                alias: 'queries',
                leftJoinAndSelect: {
                    user: 'queries.user'
                }
            }
        });
        return query.user.id;
    }

    async getQuery(queryId: number): Promise<Queries> {
        return await this.queriesRepository.findOne({
            where: { id: queryId },
            join: {
                alias: 'queries',
                leftJoinAndSelect: {
                    params: 'queries.queryParams'
                }
            }
        });
    }
}
