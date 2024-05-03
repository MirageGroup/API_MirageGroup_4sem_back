import { PhysicalRoom, VirtualRoom } from 'infra/entities/room.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'

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
}