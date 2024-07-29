import { Request, Response, NextFunction } from "express";
import MsgModel from "../models/messageModels";

const Messagecontroller = {
  GetAllMsg: async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("kfkfjdkfdjkfjd")
        const{chatId}=req.params
        // console.log("🚀 ~ file: messageController.ts:9 ~ GetAllMsg: ~ chatId:", chatId)
        const allMsg=await MsgModel.find({chatId:chatId})
        // console.log("🚀 ~ file: messageController.ts:9 ~ GetAllMsg: ~ allMsg:", allMsg)
        res.json({ success: true, messages: allMsg });
    } catch (err) {
      next(err);
    }
  },

  AddMsg: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const { senderId, chatId, message } = req.body;
      // console.log("🚀 ~ file: messageController.ts:22 ~ AddMsg: ~ message:", message)
      // console.log("🚀 ~ file: messageController.ts:22 ~ AddMsg: ~ chatId:", chatId)
      await new MsgModel({
        chatId: req.body.chatId,
        senderId: senderId,
        message:message,
        date:Date.now()
      }).save()
      const allMsg=await MsgModel.find({chatId:chatId})
      res.json({success:true,allMsg:allMsg})
    } catch (err) {
      next(err);
    }
  },
};
export default Messagecontroller;
