import jwt from "jsonwebtoken";

export async function identifier(req,res,next) {
    const token=req.cookies.jwt_token;
    console.log(token)
  if(!token){
    return res.status(401).json({
        message:"unauthorized",
        sucess:false,
        err:"No token provided"
    })
  }
let user;
  try{
    user=jwt.verify(token,process.env.JWT_SECRET)
    req.user=user
    next()
  }catch(err){
return res.status(401).json({
        message:"unauthorized",
        sucess:false,
        err:"Invalid token "
    })
  }
}