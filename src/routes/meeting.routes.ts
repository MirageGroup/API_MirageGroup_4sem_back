import appDataSource from '../infra/data-source';
import { Router } from "express";
import { MeetingServices } from '../services/meeting.service';
import { Meeting } from '../infra/entities/meeting.entity';
import { MeetingController } from '../controllers/meeting.controller';
import multer from 'multer';
import auth from '../middlewares/auth';

const MeetingRouter = Router()

const service = new MeetingServices(appDataSource.getRepository(Meeting))
const controller = new MeetingController(service)

const upload = multer({
    storage: multer.memoryStorage(),
})

MeetingRouter.post('/create', async (req, res) => {
    await controller.createMeetingController(req, res)
})

MeetingRouter.get('/authorize', async (req, res) => {
    await controller.authorize(req, res);
});

MeetingRouter.get('/callback', async (req, res) => {
    await controller.callback(req, res);
});

MeetingRouter.post('/create-meeting', async (req, res) => {
    await controller.zoomMeeting(req, res);
});

MeetingRouter.get('/get', async (req, res) => {
    await controller.getAllMeetingsController(req, res)
})

MeetingRouter.get('/get/:id', async (req, res) => {
    await controller.getMeetingController(req, res)
})

MeetingRouter.get('/fetch', auth, async (req, res) => {
    await controller.fetchMeetingByUserController(req, res)
})

MeetingRouter.delete('/delete', async (req, res) => {
    
    await controller.deleteMeetingController(req, res)
})

MeetingRouter.patch('/update/:id', async (req, res) => {
    await controller.updateMeetingController(req, res)
})

MeetingRouter.post('/:meeting_id/uploadata', upload.single('file'), async (req, res) => {
    await controller.uploadAta(req, res)
})

export default MeetingRouter