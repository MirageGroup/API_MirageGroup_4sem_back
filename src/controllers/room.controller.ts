import { Request, Response } from 'express'
import { PhysicalRoomServices, VirtualRoomServices } from 'services/room.service'
import { QueryFailedError } from 'typeorm'


export class PhysicalRoomController{
    public constructor(
        private readonly physicalroomServices: PhysicalRoomServices
    ){}

    public async createRoomController(req: Request, res: Response){
        const { occupancy, location, accessLevel } = req.body
        console.log(req.body)
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
        res.send(rooms)
    }

    public async getRoomController(req: Request, res: Response){
        const id = Number(req.params.id)
        const room = await this.physicalroomServices.getRoom(id)
        res.send(room)
    }

    public async deleteRoomController(req: Request, res: Response){
        const id = Number(req.body.id)
        console.log(id,req.params)
        await this.physicalroomServices.deleteRoom(id)
        res.sendStatus(204)
    }

    public async updateRoomController(req: Request, res: Response){
        const id = Number(req.params.id)
        const room = req.body
        await this.physicalroomServices.updateRoom(room,id)
        res.sendStatus(204)
    }

}
export class VirtualRoomController{
    public constructor(
        private readonly virtualroomServices: VirtualRoomServices
    ){}

    public async createRoomController(req: Request, res: Response){
        const { login, password, access_level } = req.body
        if(!login || !password || !access_level ) return res.sendStatus(400)

        try{
            await this.virtualroomServices.createRoom(req.body)
            res.sendStatus(201)
        }catch(error){           
            if (error instanceof QueryFailedError && error.message.includes('Duplicate entry')) {
                return res.sendStatus(409)
            }
            return res.status(500).send(error)
        }
    }

    public async getAllRoomsController(req: Request, res: Response){
        const rooms = await this.virtualroomServices.getAllRooms()
        res.send(rooms)
    }

    public async getRoomController(req: Request, res: Response){
        const id = Number(req.params.id)
        const room = await this.virtualroomServices.getRoom(id)
        res.send(room)
    }

    public async deleteRoomController(req: Request, res: Response){
        const id = Number(req.params.id)
        await this.virtualroomServices.deleteRoom(id)
        res.sendStatus(204)
    }

    public async updateRoomController(req: Request, res: Response){
        const id = Number(req.params.id)
        const room = req.body
        await this.virtualroomServices.updateRoom(room,id)
        res.sendStatus(204)
    }

}
