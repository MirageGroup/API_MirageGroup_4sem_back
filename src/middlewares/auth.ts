import { NextFunction, Request, Response } from "express";
import { EntityNotFoundError } from "typeorm";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import appDataSource from "../infra/data-source";
import { User } from "../infra/entities/user.entity";
import { UserServices } from "../services/user.services";
import { Meeting } from "../infra/entities/meeting.entity";

type JwtPayLoad = {
    userId: number
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (!authorization) return res.sendStatus(401)

    const token = authorization.split(' ')[1]
    try {
        const { userId } = jwt.verify(token, process.env.SECRET_KEY ?? '') as JwtPayLoad

        const serviceUser = appDataSource.getRepository(User)
        const serviceMeeting = appDataSource.getRepository(Meeting)

        const service = new UserServices(serviceUser, serviceMeeting)
        const user = await service.getUserById(userId)

        const { password: _, ...loggedUser } = user
        req.user = loggedUser
        next()

    } catch (error) {
        console.error(error)
        if (error instanceof EntityNotFoundError) {
            return res.sendStatus(404)
        }
        if (error instanceof JsonWebTokenError) {
            return res.status(403).send(error.message)
        }
        return res.status(500).send(error)
    }
}

export default auth