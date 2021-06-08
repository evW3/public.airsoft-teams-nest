import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../domains/users/users.model';

@Entity()
export class Devices {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    ip: string

    @Column()
    browser: string

    @ManyToOne(() => Users, user => user.devices)
    @JoinColumn()
    user: Users
}