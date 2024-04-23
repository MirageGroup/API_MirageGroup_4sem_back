import { Meeting } from "infra/entities/meeting.entity"
import { Repository } from "typeorm/repository/Repository"


export class MeetingServices {

    public constructor(
        private readonly meetingRepository: Repository<Meeting>
    ){}

    public async createMeeting(meeting: Meeting){
        return await this.meetingRepository.save(meeting)
    }

    public async getMeeting(id:number){
        return await this.meetingRepository.findOne({relations: ["participants","physicalRoom","virtualRoom"],where: {id: id}})
    }

    public async getAllMeetings(){
        return await this.meetingRepository.find({relations: ["participants","physicalRoom","virtualRoom"]},)
    }

    public async deleteMeeting(id: number){
        await this.meetingRepository.delete(id)
    }

    public async updateMeeting(meeting: Meeting, id: number){
        return await this.meetingRepository.update(id,meeting)
    }

    public async findOneOrFail (id: number){
        return await this.meetingRepository.findOneOrFail({relations: ["participants","physicalRoom","virtualRoom"],where: {id: id}})
    }
}