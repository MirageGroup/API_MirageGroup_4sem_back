import { Request, Response } from "express";
import { MeetingServices } from "services/meeting.service";
import {
  PhysicalRoomServices,
  VirtualRoomServices,
} from "services/room.service";
import { FindRelationsNotFoundError, QueryFailedError } from "typeorm";
import SendEmail from "../Data/SendEmail";
import {formatUpdateMeetingEmail,formatCreateMeetingEmail} from "../Data/formatUpdateMeetingEmail";

export class MeetingController {
  public constructor(private readonly meetingServices: MeetingServices) {}

  public async createMeetingController(req: Request, res: Response) {
    const {
      protocol,
      beginning_time,
      end_time,
      meetingType,
      physicalRoom,
      virtualRoom,
      participants,
    } = req.body;

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
      !protocol ||
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
    const id = req.body.id;
    await this.meetingServices.deleteMeeting(id);
    return res.sendStatus(204);
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
