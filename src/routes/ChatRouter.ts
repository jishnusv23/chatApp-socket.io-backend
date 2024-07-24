import express from 'express'
import { CreatChatRoom } from '../controllers/ChatController'

const router=express.Router()

router.route('/create-chatRoom').post(CreatChatRoom)

export default router