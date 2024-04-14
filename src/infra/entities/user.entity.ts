import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from './meeting.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;
    
    @Column()
    role!: string;

    @Column()
    access_level!: number;


    @ManyToMany(() => Meeting)
    @JoinTable({
        name: 'user_meeting',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'meeting_id', referencedColumnName: 'id' }
    })
    meetings!: Meeting[];
}