import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permissions } from './permissions.model';

@Entity()
export class Roles {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToMany(() => Permissions)
    @JoinTable({name: 'roles_permission'})
    rolePermissions: Permissions[];
}