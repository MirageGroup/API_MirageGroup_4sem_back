import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { PhysicalRoom, VirtualRoom } from './room.entity';

@Entity()
export class Meeting {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    protocol!: string;

    @Column()
    datetime!: Date;

    @Column({ name: 'meeting_type' })
    meetingType!: number;

    @ManyToOne(() => PhysicalRoom, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'physical_room_id' })
    physicalRoom!: PhysicalRoom;

    @ManyToOne(() => VirtualRoom, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'virtual_room_id' })
    virtualRoom!: VirtualRoom;

    @ManyToMany(() => User)
    participants!: User[];
}