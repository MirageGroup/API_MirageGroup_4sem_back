import { UserServices } from '../services/user.services';
import { UserController } from '../controllers/user.controller';
import appDataSource from '../infra/data-source';
import { User } from '../infra/entities/user.entity';
import { Router } from "express";

const userRouter = Router()

const service = new UserServices(appDataSource.getRepository(User))
const controller = new UserController(service)

userRouter.post('/create', async (req, res) => {
    await controller.createUserController(req, res)
})

export default userRouter