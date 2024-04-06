import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from './meeting.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    role!: number;

    @Column({ name: 'access_level' })
    accessLevel!: number;

    @Column()
    password!: string;

    @ManyToMany(() => Meeting)
    @JoinTable({
        name: 'participates',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'meeting_id', referencedColumnName: 'id' }
    })
    meetings!: Meeting[];
}