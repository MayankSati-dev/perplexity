// import nodemailer from "nodemailer";
// // transporter is use to communicate with (SMTP servers)
// const transporter=nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         type:'OAuth2',
//         user:process.env.GOOGLE_USER,
//         clientSecret:process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken:process.env.GOOGLE_REFRESH_TOKEN,
//         clientId:process.env.GOOGLE_CLIENT_ID
//     },
// })


// //ab yaha par verify karte hai ki humara server ready ho gaya hai ya nahi 
// //SMTP server se connect karne ke liye
// transporter.verify()
// .then(()=>{console.log("email transporter is ready to send email")})
// .then((err)=>{
// console.log("email transporter verification failed",err)
// })

// export async function SendEmail({to,subject,html,text}){
//     const mailoptions={
//         from:process.env.GOOGLE_USER,
//         to,
//         subject,
//         html,
//         text
//     }
//     const details=await transporter.sendMail(mailoptions);
//     console.log("email details:",details)
// }


import nodemailer from "nodemailer";
import { email } from "zod";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000
});

export async function SendEmail({ to, subject, html, text }) {
  try {
     const mailoptions={
       from:process.env.GOOGLE_USER,
         to,
         subject,
         html,
         text
     }
     const details=await transporter.sendMail(mailoptions);
    console.log(details)
    return details;
  } catch (err) {
    console.log(err);
    throw err;
  }
}











