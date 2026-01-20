import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import { deleteUser, getUser, getUsers, loginUser, registerUser, updateUser } from './controllers/user.js'
import { check } from './middleware/auth.js'

const app = express()
dotenv.config()

app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => res.send("Welcome to the API dashboard!"))

app.get("/users",check, getUsers)
app.get("/users/:id",check, getUser)
app.delete("/users/:id",check, deleteUser)
app.put("/users/:id",check, updateUser)

app.post("/login", loginUser)
app.post("/register", registerUser)

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.CONNECTION_URL)
    .then(app.listen(PORT, () => console.log(`Server is running on ${PORT}`)))
    .catch((err) => console.log("Error:", err))