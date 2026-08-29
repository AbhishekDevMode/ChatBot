import express from 'express';
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import dbConnect from './DB/dbConnect.js';
import authRouter from './routes/authUser.js';
import messageRouter from './routes/messageRoute.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute.js';
import { app, server } from './socket/socket.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

server.listen(PORT, () => {
    dbConnect();
    console.log(`Server is running on port ${PORT}`);
});
