import express from "express";
import Messagecontroller from "../controllers/messageController";
const router=express.Router()

router.route("/gellAllMsg/:chatId").get(Messagecontroller.GetAllMsg);
router.route('/addMsg').post(Messagecontroller.AddMsg)

export default router