import User from '../infra/entities/user.entity';

declare global {
    namespace Express {
        export interface Request {
            user: Partial<User>
        }
    }
}