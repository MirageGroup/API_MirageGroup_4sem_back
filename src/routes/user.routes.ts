import { Router } from "express";

const user = Router()

user.post('/create', (req, res) => {
    res.send('teste')
})

export default user