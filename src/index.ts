import Express, { Request, Response } from 'express';
import user from './routes/user.routes';
import appDataSource from "./infra/data-source";

const app = Express()
require('dotenv').config()

appDataSource.initialize().then(() => {
    console.log("Database initialized");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}`)
    })
})


app.get('/', async (req, res) => {
    res.send("Hello World!")
})

app.use('/user', user)