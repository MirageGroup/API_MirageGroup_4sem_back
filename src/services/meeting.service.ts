import { Meeting } from "infra/entities/meeting.entity"
import { FindRelationsNotFoundError } from "typeorm"
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

    public async fetchMeetingsByUser(id: number){
        const meetings = await this.meetingRepository
        .createQueryBuilder('meeting')
        .leftJoin('meeting.participants', 'user')
        .leftJoinAndSelect('meeting.physicalRoom', 'physicalRoom')
        .leftJoinAndSelect('meeting.virtualRoom', 'virtualRoom')
        .where('user.id = :id', { id })
        .select([
            'meeting.id',
            'meeting.protocol',
            'meeting.description',
            'meeting.beginning_time',
            'meeting.end_time',
            'meeting.meetingType',
            'physicalRoom.id',
            'physicalRoom.name',
            'physicalRoom.description',
            'physicalRoom.occupancy',
            'physicalRoom.location',
            'physicalRoom.accessLevel',
            'virtualRoom.id',
            'virtualRoom.login',
            'virtualRoom.accessLevel',
            'meeting.meetingTheme'
        ])
        .getMany()
        if(meetings.length === 0) throw new FindRelationsNotFoundError(['participants'])
        return meetings
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