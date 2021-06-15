import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users/users.model';


@Entity()
export class Teams {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Users, users => users.team)
    @JoinColumn()
    users: Users[]
}