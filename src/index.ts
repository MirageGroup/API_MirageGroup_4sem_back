import Express from 'express';
import userRouter from './routes/user.routes';
import appDataSource from "./infra/data-source";
import { PhysicalRoomRouter, VirtualRoomRouter } from './routes/room.routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = Express()
require('dotenv').config()

app.use(Express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

appDataSource.initialize().then(() => {
    console.log("Database initialized");
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