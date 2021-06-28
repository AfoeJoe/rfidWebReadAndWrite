const express = require('express');
const { read, write } = require('./utils.js');
const PORT = process.env.PORT || 3000;
const HOSTNAME = 'https://secure-springs-93980.herokuapp.com';
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: HOSTNAME,
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credetials: true,
  },
  allowEIO3: true,
});
app.use(express.static('./'));

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
io.on('connection', (socket) => {
  socket.emit('connection', 'reads');
  socket.on('read', (data) => {
    console.log('i am here');
    read(data, io);
  });
  socket.on('write', (data) => write(data, io));
});
