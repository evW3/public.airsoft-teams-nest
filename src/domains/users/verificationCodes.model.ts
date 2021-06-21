import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Users } from './users.model';

@Entity({name:'verification_codes'})
export class VerificationCodes {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Generated("uuid")
    code: string

    @ManyToOne(() => Users, users => users.codes)
    @JoinColumn({name:'user_id'})
    user: Users
}