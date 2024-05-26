import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from './meeting.entity';

@Entity()
export class PhysicalRoom {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
    
    @Column()
    location!: string;
    
    @Column()
    occupancy!: number;

    @Column()
    accessLevel!: number;

    @OneToMany(() => Meeting, (meeting) => meeting.physicalRoom)
    meetings!: Meeting[];
}

@Entity()
export class VirtualRoom {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    login!: string;

    @Column()
    password!: string;

    @Column()
    accessLevel!: number;

    @OneToMany(() => Meeting, (meeting) => meeting.virtualRoom)
    meetings!: Meeting[];
}