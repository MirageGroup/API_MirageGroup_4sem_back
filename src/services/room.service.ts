import { PhysicalRoom, VirtualRoom } from 'infra/entities/room.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import { Meeting } from 'infra/entities/meeting.entity';

export class PhysicalRoomServices {

    public constructor(
        private readonly physicalRoomRepository: Repository<PhysicalRoom>,
        private readonly meetingRepository: Repository<Meeting>
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

    public async hasMeetings(roomId: number): Promise<boolean> {
        const count = await this.meetingRepository.count({ where: { physicalRoom: { id: roomId } } });
        return count > 0;
    }
}

export class VirtualRoomServices {

    public constructor(
        private readonly virtualRoomRepository: Repository<VirtualRoom>,
        private readonly meetingRepository: Repository<Meeting>

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

    public async hasMeetings(roomId: number): Promise<boolean> {
        const count = await this.meetingRepository.count({ where: { physicalRoom: { id: roomId } } });
        return count > 0;
    }
}