import mongoose, { Types, Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    chatId:{ type:Types.ObjectId},
    senderId: {type:Types.ObjectId},
    message: {type:String},
    date:{type:Date}
  },
  { timestamps: true }
);
export default mongoose.model("message", messageSchema);
