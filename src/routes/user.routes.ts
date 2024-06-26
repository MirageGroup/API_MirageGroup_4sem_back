import { UserServices } from '../services/user.services';
import appDataSource from '../infra/data-source';
import { User } from '../infra/entities/user.entity';
import { Router } from "express";
import auth from '../middlewares/auth';
import UserController from '../controllers/user.controller';
import { Meeting } from '../infra/entities/meeting.entity';

const userRouter = Router()

const serviceUser = appDataSource.getRepository(User)
const serviceMeeting = appDataSource.getRepository(Meeting)

const service = new UserServices(serviceUser, serviceMeeting)
const controller = new UserController(service)

userRouter.post('/create', async (req, res) => {
    await controller.createUserController(req, res)
})

userRouter.post('/login', async (req, res) => {
    await controller.loginController(req, res)
})

userRouter.get('/fetchall', async (req, res) => {
    await controller.getAllUsersController(req, res)
})

userRouter.get('/getprofile', auth, async (req, res) => {
    controller.getProfileController(req, res)
})

userRouter.patch('/update', auth, async (req, res) => {
    controller.updateUserController(req, res)
})

userRouter.delete('/delete', async (req, res) => {
    controller.deleteUserController(req, res)
})

export default userRouter