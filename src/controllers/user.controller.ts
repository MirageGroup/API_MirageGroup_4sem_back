import { Request, Response } from 'express'
import { UserServices } from 'services/user.services'
import { QueryFailedError } from 'typeorm'

export class UserController {

    public constructor(
        private readonly userServices: UserServices
    ){}

    public async createUserController(req: Request, res: Response){
        const { name, email, password, role, access_level } = req.body
        if(!name || !email || !password || !role || !access_level) return res.sendStatus(400)

        try{
            await this.userServices.createUser(req.body)
            res.sendStatus(201)
        }catch(error){           
            if (error instanceof QueryFailedError && error.message.includes('Duplicate entry')) {
                return res.sendStatus(409)
            }
            return res.status(500).send(error)
        }
    }
}
