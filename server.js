const express = require('express');
 const {read,write}  =  require('./utils.js');
const port = 3000;
const hostname = '192.168.0.20';
const app = express();

const server = require('http').createServer(app)
const io = require('socket.io')(server,{cors:{origin:'http://192.168.0.20/',
methods:["GET","POST"],
transports:['websocket','polling'],
credetials:true},
allowEIO3:true
})
app.use(express.static('./'))

app.set("view engine","ejs");
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

server.listen(port,hostname,()=>{
    console.log("Seveer rynning o  3000")
})
io.on("connection",(socket)=>{
    socket.emit('connection','reads')
    socket.on('read',(data)=>read(data,io))
    socket.on('write',data=>write(data,io))
   // console.log(socket.id);
})
