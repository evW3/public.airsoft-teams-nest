import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { queryTypes, statuses } from '../../utils/enums';
import { Users } from '../users/users.model';

@Entity()
export class Queries {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "enum",
        enum: queryTypes
    })
    type: queryTypes

    @Column({
        type: "enum",
        enum: statuses,
        default: statuses.PROCESSED
    })
    status: statuses

    @ManyToOne(() => Users, user => user.queries)
    @JoinColumn({name:'user_id'})
    user: Users;
}