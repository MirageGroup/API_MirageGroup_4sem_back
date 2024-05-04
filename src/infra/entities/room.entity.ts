import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PhysicalRoom {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'virtual_room_name' })
    name!: string;

    @Column ({ name: 'physical_room_description' })
    description!: string;
    
    @Column()
    occupancy!: number;

    @Column()
    location!: string;

    @Column({ name: 'access_level' })
    accessLevel!: number;

}

@Entity()
export class VirtualRoom {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    login!: string;

    @Column()
    password!: string;

    @Column({ name: 'access_level' })
    accessLevel!: number;
}