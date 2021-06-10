import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Permissions } from '../../models/permissions.model';
import { Users } from '../users/users.model';

@Entity()
export class Roles {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToMany(() => Permissions)
    @JoinTable({name: 'roles_permission'})
    rolePermissions: Permissions[];

    @OneToMany(() => Users, users => users.role)
    users: Users[];
}