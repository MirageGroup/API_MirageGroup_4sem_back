import { Request, Response } from 'express'
import { QueryFailedError } from 'typeorm'
import { PhysicalRoomServices } from 'services/room.service'


export default class PhysicalRoomController{
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

    public async deletePhysicalRoomController(req: Request, res: Response) {
        const id = Number(req.body.id)
    
        try {
            const hasMeetings = await this.physicalroomServices.hasMeetings(id)
    
            if (hasMeetings) {
                return res.status(400).json({ message: 'Não é possível deletar a sala pois há reuniões marcadas nela.' })
            }
    
            await this.physicalroomServices.deleteRoom(id)
            return res.sendStatus(204)
        } catch (error) {
            console.error('Erro ao tentar deletar a sala física:', error)
            return res.status(500).send(error)
        }
    }

    public async updateRoomController(req: Request, res: Response){
        const id = Number(req.params.id)
        const room = req.body
        await this.physicalroomServices.updateRoom(room,id)
        return res.sendStatus(204)
    }

}

