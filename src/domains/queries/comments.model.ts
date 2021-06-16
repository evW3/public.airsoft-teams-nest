import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Queries } from './queries.model';

@Entity()
export class Comments {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @ManyToOne(() => Queries, query => query.comments)
    @JoinColumn({name: 'query_id'})
    query: Queries
}