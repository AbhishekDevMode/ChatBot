import express from 'express';
import dotenv from "dotenv";
import dbConnect from './DB/dbConnect.js';
import authRouter from './routes/authUser.js';
import messageRouter from './routes/messageRoute.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute.js';
import { useReducer } from 'react';
const PORT = process.env.PORT || 3000;

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/message',messageRouter);
app.use('/api/user/',userRouter);
app.get('/', (req, res) => {
    res.send("hi,abhishek server is running");
});
 
app.listen(PORT, () => {
    dbConnect();
    console.log(`Server is running on port ${PORT}`);
});
