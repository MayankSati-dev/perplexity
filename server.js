import app from "./src/app.js"
import connectodb from "./src/config/database.js"
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT=process.env.PORT || 8000
const httpServer=http.createServer(app)
initSocket(httpServer)

httpServer.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
connectodb()