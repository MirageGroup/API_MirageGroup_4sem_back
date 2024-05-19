import appDataSource from '../infra/data-source';
import { Router } from "express";
import { MeetingServices } from '../services/meeting.service';
import { Meeting } from '../infra/entities/meeting.entity';
import { MeetingController } from 'controllers';

const MeetingRouter = Router()

const service = new MeetingServices(appDataSource.getRepository(Meeting))
const controller = new MeetingController(service)

// ROTAS DA SALA FISICA
MeetingRouter.post('/create', async (req, res) => {
    await controller.createMeetingController(req, res)
})

MeetingRouter.get('/get', async (req, res) => {
    await controller.getAllMeetingsController(req, res)
})

MeetingRouter.get('/get/:id', async (req, res) => {
    await controller.getMeetingController(req, res)
})

MeetingRouter.delete('/delete', async (req, res) => {   
    await controller.deleteMeetingController(req, res)
})

MeetingRouter.patch('/update/:id', async (req, res) => {
    await controller.updateMeetingController(req, res)
})

export default MeetingRouter
