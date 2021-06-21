import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Queries } from './queries.model'

@Entity()
export class QueryParams {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    parameter: string

    @OneToOne(() => Queries)
    @JoinColumn({name: 'query_id'})
    query: Queries
}