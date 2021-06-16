import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { queryTypes, statuses } from '../../utils/enums';
import { Users } from '../users/users.model';
import { Comments } from './comments.model';
import { QueryParams } from './queryParams.model';

@Entity()
export class Queries {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: queryTypes
    })
    type: queryTypes;

    @Column({
        type: "enum",
        enum: statuses,
        default: statuses.PROCESSED
    })
    status: statuses;

    @ManyToOne(() => Users, user => user.queries)
    @JoinColumn({name:'user_id'})
    user: Users;

    @OneToMany(() => Comments, comment => comment.query)
    comments: Comments[];

    @OneToOne(() => QueryParams, queryParams => queryParams.query)
    queryParams: QueryParams;
}