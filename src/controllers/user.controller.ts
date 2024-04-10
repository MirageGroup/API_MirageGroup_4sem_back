import { Request, Response } from 'express'
import { User } from 'infra/entities/user.entity'
import { UserServices } from 'services/user.services'
import { EntityNotFoundError, QueryFailedError } from 'typeorm'

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
            console.error(error)
            if (error instanceof QueryFailedError && error.message.includes('Duplicate entry')) {
                return res.sendStatus(409)
            }
            return res.status(500).send(error)
        }
    }

    public async loginController(req: Request, res: Response){
        const { email, password } = req.body
        if(!email || !password) return res.sendStatus(400)
        try{
            const user = await this.userServices.getUserByEmail(email)
            const login = await this.userServices.login(user, password)

            if(!login) return res.sendStatus(400)
            const validation = await this.userServices.validation(user)
            return res.status(200).cookie("access_token", validation.token, {}).send()
        }catch(error){
            console.error(error);
            if(error instanceof EntityNotFoundError){
                return res.status(404).send(error)
            }
            return res.status(500).send(error)
        }
    }
}
