import { generateResponse,generateChatitle } from "../services/ai.service.js"
import messagemodel from "../models/message.model.js"
import chatmodel from "../models/chat.model.js"

export async function message(req,res){
 const {message,chatid}=req.body
console.log("chatid",chatid)
let title=null
let tit=null
let chat;

if(!chatid){
     title=await generateChatitle(message) 
     tit=title.text
   chat=await chatmodel.create({
   user:req.user.id,
   title:tit
 })
}
 const usermessage=await messagemodel.create({
   chat:chatid || chat._id,
   content:message ||" ",
   role:"user"
 })

 let reasult=null;
const messages=await messagemodel.find({chat:chatid || chat._id})
  reasult=await generateResponse(messages);


 const aimsg=await messagemodel.create({
  chat:chatid || chat._id,
  content:reasult,
  role:"ai"
 })
  
  res.status(201).json({
    chat,
    tit,
    usermessage,
      aimsg,
      messages
 })
}

export async function getchats(req,res){
     const id=req.user.id
     console.log(id)
     const chats=await chatmodel.find({user:id});
     res.status(200).json({
      message:"Chats retrived sucessfully",
      chats
     })
  
}

export async function getMessage(req,res){
      const {chatid}=req.params;
     const id=req.user.id
       const chat = await chatmodel.findOne({
   $and: [
    { user: id },
    { _id:chatid }
  ]
});
       if(!chat){
        return res.status(404).json({
          message:"chat not found"
        })

       }

       const messages=await messagemodel.find({ chat:chatid})
       res.status(200).json({
        message:"chats retrived sucessfully",
       messages
       })
}

export async function deletechat(req,res){
  const {chatid}=req.params;
  const chatdelete=await chatmodel.findOneAndDelete({
    _id:chatid,
     user:req.user.id
  })

  await messagemodel.deleteMany({chat:chatid})
  if(!chatdelete){
    return res.status(404).json({
      message:"chat not found"
    })
  }
  res.status(200).json({
    message:"Chat deleted sucessfully"
  })
}