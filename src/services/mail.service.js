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


import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;

// Direct API key (testing only)
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export async function SendEmail({ to, subject, html }) {
  try {
    console.log("sending email to:", to);

    const response = await tranEmailApi.sendTransacEmail({
      sender: {
        email: "themayanksati@gmail.com", // verified sender email
        name: "Perplexity"
      },
      to: [
        {
          email: to
        }
      ],
      subject: subject,
      htmlContent: html
    });

    console.log("Email sent successfully:", response);
    return response;

  } catch (err) {
    console.log("BREVO EMAIL ERROR:", err);
    throw err;
  }
}