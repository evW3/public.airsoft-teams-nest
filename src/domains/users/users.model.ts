import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { createUniqueName } from '../../utils/methods';
import { defaultPhotoUrl } from '../../constants';
import { Roles } from '../roles/roles.model';
import { Devices } from '../../models/devices.model';
import { Teams } from '../../models/teams.model';
import { VerificationCodes } from './verificationCodes.model';
import { Queries } from '../../models/queries.model';

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    password_salt: string

    @Column({ default: createUniqueName() })
    login: string

    @Column({ default: defaultPhotoUrl })
    profile_image: string

    @ManyToOne(() => Roles, role => role.users)
    @JoinColumn({name: 'role_id'})
    role: Roles;

    @OneToOne(() => Teams)
    @JoinColumn({name: 'team_id'})
    team: Teams

    @OneToMany(() => Devices, devices => devices.user)
    @JoinColumn()
    devices: Devices[]

    @OneToMany(() => VerificationCodes, verificationCodes => verificationCodes.user)
    @JoinColumn({name:'verification_codes'})
    codes: VerificationCodes[]

    @OneToMany(() => Queries, queries => queries.user)
    @JoinColumn()
    queries: Queries[]
}