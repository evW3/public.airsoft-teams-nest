import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../domains/users/users.model';

@Entity()
export class BlockList {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    description: string

    @OneToOne(() => Users)
    @JoinColumn()
    user: Users
}