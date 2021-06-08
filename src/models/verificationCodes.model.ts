import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../domains/users/users.model';

@Entity()
export class VerificationCodes {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Generated("uuid")
    code: string

    @ManyToOne(() => Users, users => users.codes)
    @JoinColumn()
    user: Users
}