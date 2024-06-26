import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { PhysicalRoom, VirtualRoom } from './room.entity';

@Entity()
export class Meeting {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    topic!: string;

    @Column()
    description!: string;

    @Column()
    beginning_time!: Date;

    @Column()
    end_time!: Date;

    @Column({ default: null })
    join_url!: string;

    @Column({ name: 'meeting_type' })
    meetingType!: number;

    @ManyToOne(() => PhysicalRoom, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'physical_room_id' })
    physicalRoom!: PhysicalRoom;

    @ManyToOne(() => VirtualRoom, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'virtual_room_id' })
    virtualRoom!: VirtualRoom;

    @ManyToMany(() => User)
    @JoinTable({
        name: 'meeting_user',
        joinColumn: { name: 'meeting_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
    })
    participants!: User[];

    @Column({ type: 'simple-array', nullable: true })
    meetingTheme?: string[];

    @Column({ type: 'simple-array', nullable: true })
    guests?: string[];

    setMeetingThemesFromString(themes: string) {
        this.meetingTheme = themes.split(',').map(theme => theme.trim());
    }

    @Column({default: null})
    ata_url!: string

}