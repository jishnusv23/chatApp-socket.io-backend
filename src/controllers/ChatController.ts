import { Request, Response, NextFunction } from "express";
import { Socket, Server } from "socket.io";
import ChatRoom from "../models/ChatModel";
import UserModel from "../models/userModel";
import { v4 as uuidv4 } from "uuid";

declare global {
  namespace NodeJS {
    interface Global {
      onlineUsers: Map<string, string>;
      chatSocket?: Socket;
    }
  }
}
declare global {
  var onlineUsers: Map<any, any>;
}
global.onlineUsers = new Map<string, string>();
let onlineUsersList: { userId: string; socketId: string }[] = [];

export const ChatController = (io: Server) => {
  try {
    io.on("connection", (socket) => {
      socket.on("add-online-users", (userId: string) => {
        onlineUsers.set(userId, socket.id);

        const existingUser = onlineUsersList.find(
          (user) => user.userId === userId
        );
        if (!existingUser) {
          onlineUsersList.push({
            userId,
            socketId: socket.id,
          });
        }
        io.emit("getOnlineUsers", onlineUsersList);
      });
      socket.on("send-messsage", (data: any) => {
        const user = onlineUsersList.find(
          (user) => user.userId === data.reciverId
        );

        const uuid = uuidv4();

        const reciverData = {
          _id: uuid,
          chatId: data.chatId,
          message: data.message,
          senderId: data.senderId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          date: Date.now(),
        };

        if (user) {
          console.log("first");
          io.to(user.socketId).emit("get-message", data);
        }
      });
      socket.on("typing", (data: any) => {
        const user = onlineUsersList.find(
          (user) => user.userId === data.reciverId
        );
        if (user) {
          io.to(user.socketId).emit("typing", data);
        }
      });
      socket.on("disconnect", () => {
        onlineUsersList = onlineUsersList.filter((user) => {
          user.socketId !== socket.id;
        });
        io.emit("getOnlineUsers", onlineUsersList);
      });
    });
  } catch (err: any) {
    console.error(err);
  }
};

export const CreatChatRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body, "iooooooioioioioio");
    const { sender_id, reciver_id } = req.body.newChat;
    const existingChat = await ChatRoom.findOne({
      members: { $all: [sender_id, reciver_id] },
    });
    // console.log("🚀 ~ file: ChatController.ts:19 ~ existingChat:", existingChat)
    const reciverData = await UserModel.findById(reciver_id);
    if (existingChat) {
      return res
        .status(201)
        .json({ success: true, reciverData, ChatRoom: existingChat });
    }
    const newRoom = await new ChatRoom({
      members: [sender_id, reciver_id],
    }).save();
    console.log("🚀 ~ file: ChatController.ts:31 ~ newRoom:", newRoom);
    return res.status(201).json({
      success: true,
      reciverData,
      ChatRoom: newRoom,
      message: "created room",
    });
  } catch (err) {
    console.log("🚀 ~ file: ChatController.ts:37 ~ err:", err);
    next(err);
  }
};
