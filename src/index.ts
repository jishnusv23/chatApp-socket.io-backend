import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from 'http'
import { Socket, Server } from "socket.io";
import { dbConnect } from "./config/dbConnections";
import userRouter from "./routes/userRouter";
import MsgRouter from "./routes/messageRouter";
import ChatRouter from './routes/ChatRouter'
import {ChatController} from './controllers/ChatController'
dotenv.config(); // Load environment variables from .env file

const app: Application = express();
const PORT = process.env.PORT || 5000;

dbConnect();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use("/user", userRouter);
app.use("/Msg", MsgRouter);
app.use('/Chat',ChatRouter)
const server=http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [`http://localhost:5173`],
    methods: ["GET", "POST"],
  },
});
ChatController(io)

server.listen(PORT, (err?: any) => {
 if (err) console.log("Something happened in backend server", err);
 console.log(`Server is running on http://localhost:${PORT}`);
});
// export default app