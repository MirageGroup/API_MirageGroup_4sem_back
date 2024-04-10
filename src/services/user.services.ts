import { User } from 'infra/entities/user.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export class UserServices {

    public constructor(
        private readonly userRepository: Repository<User>
    ){}

    public async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email: email } })
        if(!user){
            throw new EntityNotFoundError('user', email)
        }else{
            return user
        }
    }

    public async createUser(user: User): Promise<User | null> {
        user.password = await bcrypt.hash(user.password, 10)
        return await this.userRepository.save(user)
    }

    public async login(user: User, password: string): Promise<boolean> {       
        return await bcrypt.compare(password, user.password)
    }

    public async validation(user: User) {
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
}