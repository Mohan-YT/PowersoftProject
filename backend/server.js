
import express from "express"
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import cors from 'cors'
import cloudinary from 'cloudinary'

import MongoDB from "./Database/MongoDB.js";
import empRoute from "./Routes/EmpRoute.js";
import projectRouter from "./Routes/ProjectRoute.js";
import taskRouter from './Routes/TaskRouter.js'

dotenv.config()
cloudinary.config({
    cloud_name : process.env.CLOUNDINARY_NAME ,
    api_key : process.env.CLOUNDINARY_API_KEY ,
    api_secret : process.env.CLOUNDINARY_API_SECRET_KEY 
})


const PORT = process.env.PORT;
const app = express()

app.use(cors({
    origin : 'http://localhost:5173',
}))

app.use(express.json({ limit: '7mb' }));

app.use(cookieParser())

app.use(express.urlencoded({
    extended : true
}))

app.use('/employees',empRoute)
app.use('/projects',projectRouter)
app.use('/tasks',taskRouter)

app.listen(PORT,()=>{
    console.log(`Server run port number ${PORT}`)
    MongoDB()
})