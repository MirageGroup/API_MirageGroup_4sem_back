import { Request, Response } from 'express'
import { PhysicalRoomServices, VirtualRoomServices } from 'services/room.service'
import { QueryFailedError } from 'typeorm'


export class PhysicalRoomController{
    public constructor(
        private readonly physicalroomServices: PhysicalRoomServices
    ){}

    public async createRoomController(req: Request, res: Response){
        const { occupancy, location, accessLevel, } = req.body
        if(!occupancy || !location || !accessLevel ) return res.sendStatus(400)

        try{
            await this.physicalroomServices.createRoom(req.body)
            res.sendStatus(201)
        }catch(error){           
            if (error instanceof QueryFailedError && error.message.includes('Duplicate entry')) {
                return res.sendStatus(409)
            }
            return res.status(500).send(error)
        }
    }

    public async getAllRoomsController(req: Request, res: Response){
        const rooms = await this.physicalroomServices.getAllRooms()
        return res.send(rooms)
    }

    public async getRoomController(req: Request, res: Response){
        const id = Number(req.params.id)
        const room = await this.physicalroomServices.getRoom(id)
        return res.send(room)
    }

    public async deleteRoomController(req: Request, res: Response){
        const id = Number(req.body.id)
        await this.physicalroomServices.deleteRoom(id)
        return res.sendStatus(204)
    }

    public async updateRoomController(req: Request, res: Response){
        const id = Number(req.params.id)
        const room = req.body
        await this.physicalroomServices.updateRoom(room,id)
        return res.sendStatus(204)
    }

    public async checkAvailableRooms(req: Request, res: Response){
        const meeting = req.body
        const availableRooms = await this.physicalroomServices.checkAvailableRooms(meeting)
        console.log(availableRooms)
        return res.status(200).send(availableRooms)
    }

}
export class VirtualRoomController{
    public constructor(
        private readonly virtualroomServices: VirtualRoomServices
    ){}

    public async createRoomController(req: Request, res: Response){
        const { login, password, accessLevel } = req.body
        if(!login || !password || !accessLevel ) return res.sendStatus(400)

        try{
            await this.virtualroomServices.createRoom(req.body)
            return res.sendStatus(201)
        }catch(error){           
            if (error instanceof QueryFailedError && error.message.includes('Duplicate entry')) {
                return res.sendStatus(409)
            }
            return res.status(500).send(error)
        }
    }

    public async getAllRoomsController(req: Request, res: Response){
        const rooms = await this.virtualroomServices.getAllRooms()
        return res.send(rooms)
    }

    public async getRoomController(req: Request, res: Response){
        const id = Number(req.params.id)
        const room = await this.virtualroomServices.getRoom(id)
        return res.send(room)
    }

    public async deleteRoomController(req: Request, res: Response){
        const id = Number(req.body.id)
        await this.virtualroomServices.deleteRoom(id)
        return res.sendStatus(204)
    }

    public async updateRoomController(req: Request, res: Response){
        const id = Number(req.params.id)
        const room = req.body
        await this.virtualroomServices.updateRoom(room,id)
        return res.sendStatus(204)
    }

}
