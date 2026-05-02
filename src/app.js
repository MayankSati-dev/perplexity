import "dotenv/config"
import cookieparser from "cookie-parser"
import express from "express";
import morgan from "morgan";
import cors from "cors"
import path from "path"
const app=express();
app.use(express.json())
app.use(cookieparser())
app.use(morgan("dev"))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const publicPath = path.join(__dirname, "../public");
import authroutes from "../src/routes/auth.routes.js";
import chatroutes from "./routes/chat.routes.js";

app.use("/api/chat",chatroutes)
app.use("/api",authroutes)
app.use(express.static(publicPath));

app.use((req, res) => {
   res.sendFile(path.join(publicPath, "index.html"));
});
export default app








