import { Meeting } from "infra/entities/meeting.entity"
import { Repository } from "typeorm/repository/Repository"
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

type params = {
    Bucket: string | undefined;
    Key: string;
    Body: Buffer;
}

export class MeetingServices {

    public constructor(
        private readonly meetingRepository: Repository<Meeting>,
        private readonly s3Client = new S3Client({ region: process.env.AWS_REGION })
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

    public async uploadAta(params: params, meeting: Meeting){
        await this.s3Client.send(new PutObjectCommand(params))
        const url = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${params.Bucket}/${params.Key}`
        meeting.ata_url = url
        await this.meetingRepository.save(meeting)
    }

}