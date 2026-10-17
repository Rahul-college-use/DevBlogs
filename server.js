const http = require("http");
const port = 3000;
const app = require('../Backend/app')
const server = http.createServer(app)

server.listen(port,()=>{
    console.log("Server is start port on "+port)
})