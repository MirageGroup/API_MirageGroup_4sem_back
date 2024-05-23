import { Meeting } from "infra/entities/meeting.entity";
import { FindRelationsNotFoundError } from "typeorm";
import { Repository } from "typeorm/repository/Repository";
import axios from "axios";

export class MeetingServices {
  public constructor(private readonly meetingRepository: Repository<Meeting>) {}

  public async createMeeting(meeting: Meeting) {
    return await this.meetingRepository.save(meeting);
  }

  public async getMeeting(id: number) {
    return await this.meetingRepository.findOne({
      relations: ["participants", "physicalRoom", "virtualRoom"],
      where: { id: id },
    });
  }

  public async getAllMeetings() {
    return await this.meetingRepository.find({
      relations: ["participants", "physicalRoom", "virtualRoom"],
    });
  }

  public async fetchMeetingsByUser(id: number) {
    const meetings = await this.meetingRepository
      .createQueryBuilder("meeting")
      .leftJoinAndSelect("meeting.participants", "participant") // Certifique-se de que o alias aqui está correto
      .leftJoinAndSelect("meeting.physicalRoom", "physicalRoom")
      .leftJoinAndSelect("meeting.virtualRoom", "virtualRoom")
      .where("participant.id = :id", { id })
      .select([
        "meeting.id",
        "meeting.topic",
        "meeting.description",
        "meeting.beginning_time",
        "meeting.end_time",
        "meeting.meetingType",
        "physicalRoom.id",
        "physicalRoom.name",
        "physicalRoom.description",
        "physicalRoom.occupancy",
        "physicalRoom.location",
        "physicalRoom.accessLevel",
        "virtualRoom.id",
        "virtualRoom.login",
        "virtualRoom.accessLevel",
        "meeting.meetingTheme",
        "participant",
      ])
      .getMany();

    if (meetings.length === 0)
      throw new FindRelationsNotFoundError(["participants"]);

    return meetings;
  }
  public async deleteMeeting(id: number) {
    await this.meetingRepository.delete(id);
  }

  public async updateMeeting(meeting: Meeting, id: number) {
    return await this.meetingRepository.update(id, meeting);
  }

  public async findOneOrFail(id: number) {
    return await this.meetingRepository.findOneOrFail({
      relations: ["participants", "physicalRoom", "virtualRoom"],
      where: { id: id },
    });
  }

  public async zoomMeting(
    topic: string,
    startDate: string,
    duration: string,
    accessToken: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `https://api.zoom.us/v2/users/me/meetings`,
        {
          topic,
          start_time: startDate,
          duration,
          type: 2,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Erro ao criar a reunião:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getAccessToken(code: string): Promise<string> {
    try {
      const requestBody = new URLSearchParams();
      requestBody.append("grant_type", "authorization_code");
      console.log(code);
      requestBody.append("code", code);
      requestBody.append(
        "redirect_uri",
        "http://localhost:8080/meeting/callback"
      );

      const response = await axios.post(
        "https://zoom.us/oauth/token",
        requestBody.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${process.env.CLI_CODEBASE64}==`,
          },
        }
      );

      return response.data.access_token;
    } catch (error: any) {
      console.error(
        "Erro ao obter o token de acesso:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}
