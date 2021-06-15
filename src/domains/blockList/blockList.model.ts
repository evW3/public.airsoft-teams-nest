import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users/users.model';

@Entity()
export class BlockList {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @OneToOne(() => Users, users => users.blockList)
    @JoinColumn({name: 'user_id'})
    user: Users
}