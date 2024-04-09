import { User } from 'infra/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'

export class UserServices {

    public constructor(
        private readonly userRepository: Repository<User>
    ){}

    public async createUser(user: User){
        user.password = await bcrypt.hash(user.password, 10)
        return await this.userRepository.save(user)
    }
}