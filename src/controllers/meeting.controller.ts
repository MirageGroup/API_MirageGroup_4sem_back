import { Request, Response } from 'express'
import { MeetingServices } from 'services/meeting.service'
import { PhysicalRoomServices, VirtualRoomServices } from 'services/room.service'
import { QueryFailedError } from 'typeorm'


export class MeetingController{
    public constructor(
        private readonly meetingServices: MeetingServices
    ){}

    public async authorize(req: Request, res: Response) {
        res.redirect(
            `https://zoom.us/oauth/authorize?response_type=code&client_id=zOA6nVmySOiFabQDWBcX1A&redirect_uri=http://localhost:8080/meeting/callback`
        );
    }

    public async callback(req: Request, res: Response) {
        const code = req.query.code as string;
        try {
            console.log('Código:', code);
            const accessToken = await this.meetingServices.getAccessToken(code);
            console.log('Token de Acesso:', accessToken);
            res.redirect(`http://localhost:3000/dashboard?accessToken=${accessToken}`);
        } catch (error) {
            console.error('Erro ao obter token de acesso:', error);
        }
    }

    public async zoomMeeting(req: Request, res: Response) {
        const { topic, startDate, duration, accessToken } = req.body;
        console.log("Tópico:", topic);
        console.log("Data de Início:", startDate);
        console.log("Duração:", duration);
        console.log("Token de Acesso:", accessToken);
        try {
            const reuniao = await this.meetingServices.zoomMeting(topic, startDate, duration, accessToken);
            res.json(reuniao);
        } catch (error) {
            console.error('Erro ao criar reunião:', error);
            res.status(500).send('Erro ao criar reunião.');
        }
    }

    public async createMeetingController(req: Request, res: Response){
        const { topic, beginning_time, end_time, meetingType, physicalRoom, virtualRoom, participants, join_url, start_url, passcode} = req.body

        console.log("BODY ", req.body)

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


        if(!topic || !beginning_time || !end_time || !meetingType ||!participants) return res.sendStatus(400)

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

}