import Express, { NextFunction, Request, Response } from "express";
import userRouter from './routes/user.routes';
import appDataSource from "./infra/data-source";
import { PhysicalRoomRouter, VirtualRoomRouter } from './routes/room.routes';
import cookieParser from 'cookie-parser';
import MeetingRouter from './routes/meeting.routes';

require('dotenv').config()
const app = Express()


const cors = require("cors");


app.use(Express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

})

appDataSource.initialize().then((connection) => {
    console.log("Database initialized")
    connection.runMigrations()
    app.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}`)
    })
})


app.get('/', async (req, res) => {
    res.send("Hello World!")
})

app.use('/user', userRouter)
app.use('/physicalRoom', PhysicalRoomRouter)
app.use('/virtualRoom', VirtualRoomRouter)
app.use('/meeting', MeetingRouter)

