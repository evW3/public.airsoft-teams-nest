import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Teams {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}