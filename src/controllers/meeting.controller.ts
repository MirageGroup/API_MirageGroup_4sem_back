import { Request, Response } from 'express'
import { MeetingServices } from 'services/meeting.service'
import { PhysicalRoomServices, VirtualRoomServices } from 'services/room.service'
import { FindRelationsNotFoundError, QueryFailedError } from "typeorm";
import SendEmail from "../Data/SendEmail";
import {formatUpdateMeetingEmail,formatCreateMeetingEmail} from "../Data/formatUpdateMeetingEmail";

export class MeetingController {
  public constructor(
      private readonly meetingServices: MeetingServices
  ) {}

    public async authorize(req: Request, res: Response) {
        res.redirect(
            `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.CLI_ID}&redirect_uri=http://localhost:8080/meeting/callback`
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
      
  public async createMeetingController(req: Request, res: Response) {
    const {
      topic,
      beginning_time,
      end_time,
      meetingType,
      physicalRoom,
      virtualRoom,
      participants,
    } = req.body;

    console.log("BODY ", req.body)

    if (meetingType == 1) {
      if (physicalRoom == null || virtualRoom != null) {
        console.log(
          "erro: reunião virtual deve ter ao menos uma sala fisica e nenhuma sala virtual"
        );
        return res
          .status(400)
          .send(
            "erro: reunião virtual deve ter ao menos uma sala fisica e nenhuma sala virtual"
          );
      }
    } else if (meetingType == 2) {
      if (physicalRoom == null && virtualRoom == null) {
        console.log("erro: reunião mista deve ter sala fisica e sala virtual");
        return res
          .status(400)
          .send("erro: reunião mista deve ter sala fisica e sala virtual");
      }
    } else if (meetingType == 3) {
      if (physicalRoom != null || virtualRoom == null) {
        console.log(
          "erro: reunião virtual deve ter ao menos uma sala virtual e nenhuma sala fisica"
        );
        return res
          .status(400)
          .send(
            "erro: reunião virtual deve ter ao menos uma sala virtual e nenhuma sala fisica"
          );
      }
    }

    if (
      !topic ||
      !beginning_time ||
      !end_time ||
      !meetingType ||
      !participants
    )
      return res.sendStatus(400);

    try {
      await this.meetingServices.createMeeting(req.body);


      const detalhesReuniao = formatCreateMeetingEmail(req.body);
      const destinatarios = participants.map(
        (participant:any) => participant.email
      );
      const assunto = "Criação de Reunião";
      await SendEmail(destinatarios.join(","), assunto, detalhesReuniao);


      return res.sendStatus(201);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes("Duplicate entry")
      ) {
        return res.sendStatus(409);
      }
      console.log(error);
      return res.status(500).send(error);
    }
  }

  public async getAllMeetingsController(req: Request, res: Response) {
    const rooms = await this.meetingServices.getAllMeetings();
    return res.send(rooms);
  }

  public async getMeetingController(req: Request, res: Response) {
    const id = Number(req.params.id);
    const room = await this.meetingServices.getMeeting(id);
    return res.send(room);
  }

  public async fetchMeetingByUserController(req: Request, res: Response) {
    const id = req.params.meetingId
    try{
      const meetings = await this.meetingServices.fetchMeetingsByUser(Number(id))
      return res.send(meetings)
    }catch(error){
      if (error instanceof FindRelationsNotFoundError){
        res.status(404).send({ message: "User not found" })
      }
    }
  }

  public async deleteMeetingController(req: Request, res: Response) {
        const id = req.body.id
    
        try {
            const hasMeetings = await this.meetingServices.hasMeetingsInRoom(id)
    
            if (hasMeetings) {
                return res.status(400).json({ message: 'Não é possível deletar a sala pois há reuniões marcadas nela.' })
            }
    
            await this.meetingServices.deleteMeeting(id)
            return res.sendStatus(204)
        } catch (error) {
            console.error('Erro ao tentar deletar a sala de reuniões:', error)
            return res.status(500).json({ message: 'Erro interno no servidor.' })
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
    
  public async updateMeetingController(req: Request, res: Response) {
    const id = Number(req.params.id);
    const meetingData = req.body;
    const { participants, ...meetingInfo } = meetingData;

    try {
      await this.meetingServices.updateMeeting(meetingInfo, id);

      if (participants && participants.length > 0) {
        const meeting = await this.meetingServices.findOneOrFail(id);

        if (!meeting) {
          throw new Error("Reunião não encontrada");
        }

        meeting.participants = participants;
        await this.meetingServices.createMeeting(meeting);
        // Formatar os detalhes da reunião em texto
        const detalhesReuniao = formatUpdateMeetingEmail(meeting);

        // Envie o email para os participantes da reunião
        const destinatarios = participants.map(
          (participant:any) => participant.email
        );
        const assunto = "Atualização de Reunião";
        await SendEmail(destinatarios.join(","), assunto, detalhesReuniao);
      }

      return res.sendStatus(204);
    } catch (error) {
      console.error("Erro ao atualizar reunião:", error);
      return res.status(500).send("Erro ao atualizar reunião.");
    }
  }
}
