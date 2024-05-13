import { Request, Response } from 'express'
import { MeetingServices } from 'services/meeting.service'
import { PhysicalRoomServices, VirtualRoomServices } from 'services/room.service'
import { QueryFailedError } from 'typeorm'


export class MeetingController{
    public constructor(
        private readonly meetingServices: MeetingServices
    ){}

    public async createMeetingController(req: Request, res: Response){
        const { protocol, beginning_time, end_time, meetingType,physicalRoom,virtualRoom,participants} = req.body

        if(meetingType == 1){
            if(physicalRoom == null || virtualRoom != null){
                console.log("erro: reunião virtual deve ter ao menos uma sala fisica e nenhuma sala virtual")
                return res.status(400).send('erro: reunião virtual deve ter ao menos uma sala fisica e nenhuma sala virtual')
            }
        }else if (meetingType == 2){
            if(physicalRoom == null && virtualRoom == null){
                console.log("erro: reunião mista deve ter sala fisica e sala virtual")
                return res.status(400).send('erro: reunião mista deve ter sala fisica e sala virtual')
            }
        }else if (meetingType == 3){
            if(physicalRoom != null || virtualRoom == null){
                console.log("erro: reunião virtual deve ter ao menos uma sala virtual e nenhuma sala fisica")
                return res.status(400).send('erro: reunião virtual deve ter ao menos uma sala virtual e nenhuma sala fisica')
            }
        }


        if(!protocol || !beginning_time || !end_time || !meetingType ||!participants) return res.sendStatus(400)

        try{
            await this.meetingServices.createMeeting(req.body)
            return res.sendStatus(201)
        }catch(error){           
            if (error instanceof QueryFailedError && error.message.includes('Duplicate entry')) {
                return res.sendStatus(409)
            }
            console.log(error)
            return res.status(500).send(error)
        }
    }

    public async getAllMeetingsController(req: Request, res: Response){
        const rooms = await this.meetingServices.getAllMeetings()
        return res.send(rooms)
    }

    public async getMeetingController(req: Request, res: Response){
        const id = Number(req.params.id)
        const room = await this.meetingServices.getMeeting(id)
        return res.send(room)
    }

    public async deleteMeetingController(req: Request, res: Response){
        const id = req.body.id
        await this.meetingServices.deleteMeeting(id)
        return res.sendStatus(204)
    }

    public async updateMeetingController(req: Request, res: Response){
        const id = Number(req.params.id);
        const meetingData = req.body;
        const { participants, ...meetingInfo } = meetingData;
    
        try {
            await this.meetingServices.updateMeeting(meetingInfo, id);
    
            if (participants && participants.length > 0) {
                const meeting = await this.meetingServices.findOneOrFail(id);
    
                if (!meeting) {
                    throw new Error('Reunião não encontrada');
                }
    
                meeting.participants = participants;
                await this.meetingServices.createMeeting(meeting);
            }
    
            return res.sendStatus(204);
        } catch (error) {
            console.error('Erro ao atualizar reunião:', error);
            return res.status(500).send('Erro ao atualizar reunião.');
        }
    }

    public async uploadAta(req: Request, res: Response){
        if(!req.file?.originalname) return res.sendStatus(400)
        const meeting = await this.meetingServices.getMeeting(parseInt(req.params.meeting_id))
        if(!meeting) return res.sendStatus(404)
        try{
            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `meetings/meeting_${req.params.meeting_id}/${req.file?.originalname}`,
                Body: req.file?.buffer
            }
            await this.meetingServices.uploadAta(params, meeting)
            return res.sendStatus(200)
        }catch(error){
            console.error(error)
            return res.status(500).send(error)
        }
    }

}