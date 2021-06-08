import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Queries } from './queries.model';

@Entity()
export class Comments {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @OneToOne(() => Queries)
    @JoinColumn()
    query: Queries
}