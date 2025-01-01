import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoute from "./routes/users.js"
import videoRoute from "./routes/video.js"
import commentRoute from "./routes/comment.js"
import authRoute from "./routes/auth.js"
import cookieParser from "cookie-parser"
import cors from "cors"







const app = express()

dotenv.config()





const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
 };
 
 app.use(cors(corsOptions));



const connect = ()=>{
    mongoose.connect(process.env.MONGO).then(()=>{
        console.log("Connected TO DB")
    }).catch((err)=>{
        console.log("error",err)
    })
}

app.use(cookieParser())
app.use(express.json())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)

app.use("/api/videos",videoRoute)

app.use("/api/comment",commentRoute)
app.use((err,req,res,next)=>{
    const status = err.status || 500
    const message = err.message || "Something went wrong"
    return res.status(status).json({
        success:false,
        status,
        message
    })
})



app.listen(8800,()=>{
    connect()
    console.log("Connected Successfully")
})


