import { Request, Response } from 'express'
import { UserServices } from '../services/user.services'
import { EntityNotFoundError, QueryFailedError } from 'typeorm'

export default class UserController {

    public constructor(
        private readonly userServices: UserServices
    ) { }

    public async createUserController(req: Request, res: Response) {
        const { name, email, password, role, access_level } = req.body
        if (!name || !email || !password || !role || !access_level) return res.sendStatus(400)

        try {
            await this.userServices.createUser(req.body)
            res.sendStatus(201)
        } catch (error) {
            console.error(error)
            if (error instanceof QueryFailedError && error.message.includes('Duplicate entry')) {
                return res.sendStatus(409)
            }
            return res.status(500).send(error)
        }
    }

    public async loginController(req: Request, res: Response) {
        const { email, password } = req.body
        if (!email || !password) return res.sendStatus(400)
        try {
            const user = await this.userServices.getUserByEmail(email)
            const login = await this.userServices.login(user, password)

            if (!login) return res.sendStatus(400)
            const validation = await this.userServices.createToken(user)
            return res.status(200).send({ token: validation.token })
        } catch (error) {
            console.error(error);
            if (error instanceof EntityNotFoundError) {
                return res.status(404).send(error)
            }
            return res.status(500).send(error)
        }
    }

    public async getAllUsersController(req: Request, res: Response) {
        const users = await this.userServices.getAllUsers()
        return res.status(200).send(users)
    }

    public async getProfileController(req: Request, res: Response) {
        return res.send(req.user)
    }

    public async updateUserController(req: Request, res: Response) {
        const { name, email, password, role, access_level } = req.body
        if (!name || !email || !password || !role || !access_level) return res.sendStatus(400)
        const id = Number(req.body.id)
        try {
            await this.userServices.updateUser(id, req.body)
            res.sendStatus(200)
        } catch (error) {
            console.error(error)
            return res.status(500).send(error)
        }
    }

    public async deleteUserController(req: Request, res: Response) {
        const id = req.body.id;

        try {
            const hasMeetings = await this.userServices.hasMeetings(id);

            if (hasMeetings) {
                return res.status(400).json({ message: 'Não é possível deletar o usuário pois ele está associado a reuniões.' });
            }

            await this.userServices.deleteUser(id);
            return res.sendStatus(204);
        } catch (error) {
            console.error('Erro ao tentar deletar o usuário:', error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }
    
}