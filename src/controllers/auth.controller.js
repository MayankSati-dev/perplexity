import usermodel from "../models/user.model.js"
import jwt from "jsonwebtoken";
import {SendEmail} from "../services/mail.service.js"
      
export async function register(req,res){
  const {username,email,password}=req.body;

  const isUseralreadyExist=await usermodel.findOne({
    $or:[{username},{email}]
})

if (isUseralreadyExist) {
  if (!isUseralreadyExist.verified) {
    return res.status(409).json({
      message: "Email already registered but not verified",
      success: false,
      isVerified: false
    })
  }

  return res.status(409).json({
    message: "User already exists",
    success: false,
    isVerified: true
  })
}



const user=await usermodel.create({username,email,password})

const emailVerifycationtoken=jwt.sign({
    email:user.email,
},process.env.JWT_SECRET,{expiresIn:"10m"})




await SendEmail({
    to:email,
    subject:"welcome to perplexity",
    html:`<p>Hy ${username},</p>
          <p>Thanku for registering at <strong>perplexity</strong> we are excited to have you on Board! Best regards, the perplexity team</p>
          <p>please verify your email adress by clicking the link below:</P>
          <a href="https://perplexity-3-pqhq.onrender.com/api/verify-email?token=${emailVerifycationtoken}">verify email</a>
          <p>best regards,</p>
          <p>the perplexity team</p>`
})




res.status(201).json({
    message:'user registered sucessfully',
    sucess:true,
    user:{
        id:user._id,
        name:user.username,
        email:user.email
    }
})
}

export async function resendemail(req,res){

const {username,email,password}=req.body;

  const isUseralreadyExist=await usermodel.findOne({
    $or:[{username},{email}]
})

   if(!isUseralreadyExist){
      return res.status(404).json({
         message:"User not found",
         success:false
      })
   }



if(isUseralreadyExist.verified==true){
   return res.status(409).json({
    message:'your email is already verified',
    sucess:false,
    err:"email is verified"
   })

}
 const emailVerifycationtoken=jwt.sign({
    email:isUseralreadyExist.email,
},process.env.JWT_SECRET,{expiresIn:'10m'})


  await SendEmail({
    to:email,
    subject:"welcome to perplexity",
    html:`<p>Hy ${username},</p>
          <p>Thanku for registering at <strong>perplexity</strong> we are excited to have you on Board! Best regards, the perplexity team</p>
          <p>please verify your email adress by clicking the link below:</P>
          <a href="https://perplexity-3-pqhq.onrender.com/api/verify-email?token=${emailVerifycationtoken}">verify email</a>
          <p>best regards,</p>
          <p>the perplexity team</p>`
})
res.status(201).json({
    message:'mail sent sucessfully',
    sucess:true,
    email:isUseralreadyExist.email
})


}

export async function verifymail(req,res){
try{
    const { token } = req.query;

 const decode=jwt.verify(token,process.env.JWT_SECRET)

 const user=await usermodel.findOne({email:decode.email})
 if(!user){
    return res.status(400).json({
        message:"Invalid token",
        sucess:false,
        err:"user not found"
    })
 }
 

if(user.verified){
     return  res.redirect("https://perplexity-3-pqhq.onrender.com/login")
}

 user.verified=true;
 await user.save();
const html=`
    <h1>Email verified sucessfully</h1>
    <P>your email has beeen verified. you can now log in to your account</p>
    <a href="https://perplexity-3-pqhq.onrender.com/login">Go to Login</a>
    `
   
res.send(html)


}catch(err){
      return res.status(400).json({
        message:"Invalid token",
        sucess:false,
        err:"user not found"
})
}
}

export async function login(req,res){
    const {email,password}=req.body;
    const user =await usermodel.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"Invalid email or password",
            sucess:false,
            err:"user not found"
        })
    }
    const ispasswordmatch=await user.comparePassword(password);
    if(!ispasswordmatch){
        return res.status(400).json({
            message:"Invalid email or password",
            sucess:false,
            err:"Invalid password"
        })
    }
 if(!user.verified){
        return res.status(400).json({
            message:"Invalid email or password",
            sucess:false,
            err:"Email not verified"
        })
    }
const token=jwt.sign({
    id:user._id,
    email:user.email
},process.env.JWT_SECRET,{expiresIn:"7d"})
      res.cookie("jwt_token",token)

      res.status(201).json({
        message:'login sucessfully',
        sucess:true,
        user:{
            id:user._id,
            name:user.username,
            eamil:user.email
        }
      })
}

export async function getme(req,res){
    const userId=req.user.id;

    const user=await usermodel.findById(userId).select("-password");
    if(!user){
        return res.status(404).json({
            message:'user not found',
            sucess:false,
            err:"user not found"
        })
    }
    res.status(201).json({
        message:"user deatils fetched sucesssfully",
        sucess:true,
        user
    })
}


export async function logout(req, res) {
  try {
    res.clearCookie("jwt_token", {
      httpOnly: true,
      secure: false, 
      sameSite: "lax"
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      message: "Logout failed",
      success: false
    });
  }
}