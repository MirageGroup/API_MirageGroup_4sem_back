import { PhysicalRoom, VirtualRoom } from 'infra/entities/room.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import { Meeting } from '../infra/entities/meeting.entity';

export class PhysicalRoomServices {

    public constructor(
        private readonly physicalRoomRepository: Repository<PhysicalRoom>
    ){}

    public async createRoom(room: PhysicalRoom){
        return await this.physicalRoomRepository.save(room)
    }

    public async getRoom(id:number){
        return await this.physicalRoomRepository.findOneBy({id})
    }

    public async getAllRooms(){
        return await this.physicalRoomRepository.find()
    }

    public async deleteRoom(id: number){
        await this.physicalRoomRepository.delete(id)
    }

    public async updateRoom(room: PhysicalRoom, id: number){
        return await this.physicalRoomRepository.save(room)
    }

    public async checkAvailableRooms(meeting: Meeting, userAccessLevel: number): Promise<PhysicalRoom[]> {
        const numberOfParticipants = meeting.participants.length;
        const beginningTime = meeting.beginning_time;
        const endTime = meeting.end_time;

        const rooms = await this.physicalRoomRepository.createQueryBuilder('physicalRoom')
            .leftJoinAndSelect('physicalRoom.meetings', 'meeting')
            .where('physicalRoom.occupancy >= :numberOfParticipants', { numberOfParticipants })
            .andWhere('physicalRoom.accessLevel <= :userAccessLevel', { userAccessLevel })
            .andWhere(qb => {
                const subQuery = qb.subQuery()
                    .select('meeting.id')
                    .from(Meeting, 'meeting')
                    .where('meeting.physicalRoom.id = physicalRoom.id')
                    .andWhere('meeting.beginning_time < :endTime', { endTime })
                    .andWhere('meeting.end_time > :beginningTime', { beginningTime })
                    .getQuery();
                return `NOT EXISTS ${subQuery}`;
            })
            .getMany();

        return rooms;
    }
}

export class VirtualRoomServices {

    public constructor(
        private readonly virtualRoomRepository: Repository<VirtualRoom>
    ){}

    public async createRoom(room: PhysicalRoom){
        return await this.virtualRoomRepository.save(room)
    }

    public async getRoom(id:number){
        return await this.virtualRoomRepository.findOneBy({id})
    }

    public async getAllRooms(){
        return await this.virtualRoomRepository.find()
    }

    public async deleteRoom(id: number){
        await this.virtualRoomRepository.delete(id)
    }

    public async updateRoom(room: PhysicalRoom, id: number){
        return await this.virtualRoomRepository.update(room.id, room)
    }

    async checkAvailableRooms(meeting: Meeting, userAccessLevel: number): Promise<VirtualRoom[]> {
        const beginningTime = meeting.beginning_time;
        const endTime = meeting.end_time;
        const rooms = await this.virtualRoomRepository.createQueryBuilder('virtualRoom')
            .leftJoinAndSelect('virtualRoom.meetings', 'meeting')
            .where('virtualRoom.accessLevel <= :userAccessLevel', { userAccessLevel })
            .andWhere(qb => {
                const subQuery = qb.subQuery()
                    .select('meeting.id')
                    .from(Meeting, 'meeting')
                    .where('meeting.virtualRoom.id = virtualRoom.id')
                    .andWhere('meeting.beginning_time < :endTime', { endTime })
                    .andWhere('meeting.end_time > :beginningTime', { beginningTime })
                    .getQuery();
                return `NOT EXISTS ${subQuery}`;
            })
            .getMany();

        return rooms;
    }
}