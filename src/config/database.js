import "dotenv/config"
import mongoose from "mongoose";


async function connectodb(){
  await mongoose.connect(process.env.DATABASE)
    console.log("connected to db")
}
export default connectodb