import { User } from 'infra/entities/user.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { Meeting } from '../infra/entities/meeting.entity';

export class UserServices {

    public constructor(
        private readonly userRepository: Repository<User>,
        private readonly meetingRepository: Repository<Meeting>
    ){}

    public async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email: email } })
        if(!user){
            throw new EntityNotFoundError('user', 'email = ' + email)
        }else{
            return user
        }
    }

    public async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: id } })
        if(!user){
            throw new EntityNotFoundError('user', id)
        }else{
            return user
        }
    }

    public async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find({
            select: ['id', 'name', 'email', 'role', 'access_level']
        })
    }

    public async createUser(user: User): Promise<User | null> {
        user.password = await bcrypt.hash(user.password, 10)
        return await this.userRepository.save(user)
    }

    public async login(user: User, password: string): Promise<boolean> {    
        return await bcrypt.compare(password, user.password)
    }

    public async createToken(user: User) {
        const token = jwt.sign({
                userId: user.id
            },
            process.env.SECRET_KEY ?? '',
            {
                expiresIn: '8h'
            }
        )

        const { password: _, ...userLogin } = user

        return {
            user: userLogin,
            token: token
        }
    }

    public async updateUser(id:number,user: User) {
        return await this.userRepository.update(id, user)
    }

    public async deleteUser(id: number) {
        return await this.userRepository.delete(id)
    }

    public async hasMeetings(userId: number): Promise<boolean> {
        const count = await this.meetingRepository.count({ where: { participants: { id: userId } } });
        return count > 0;
    }
}