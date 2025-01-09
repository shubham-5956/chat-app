import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";


dotenv.config({});

const app=express();
app.use(express.json());
app.use(cookieParser());

const PORT= process.env.PORT;

app.use("/api/v1/user",userRoute);
app.use("api/v1/message",messageRoute);

app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server listeniing at port ${PORT}`);
});