import { Router } from "express";
import { getchats, message ,getMessage, deletechat} from "../controllers/chat.controller.js";
import { identifier } from "../middlewares/auth.middleware.js";
const chatroutes=Router()

chatroutes.post("/message",identifier,message)
chatroutes.get("/get-chats",identifier,getchats)
chatroutes.get("/get-messages/:chatid",identifier,getMessage)
chatroutes.delete("/deletechat/:chatid",identifier,deletechat)

export default chatroutes