import { Router } from "express";
import {register,verifymail,login,getme,resendemail,logout} from "../controllers/auth.controller.js"
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { identifier } from "../middlewares/auth.middleware.js";
const authroutes=Router();


authroutes.post("/register",registerValidator, register)
authroutes.get("/verify-email",verifymail)
authroutes.post("/resendemail",resendemail)
authroutes.post("/login",loginValidator,login)
authroutes.get("/get-me",identifier,getme)
authroutes.post("/logout", logout)
export default authroutes