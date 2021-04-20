const express = require("express");
const { read, write } = require("./utils.js");
const PORT = 3000;
const HOSTNAME = "192.168.0.19";
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: HOSTNAME,
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credetials: true,
  },
  allowEIO3: true,
});
app.use(express.static("./"));

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on ${PORT}`);
});
io.on("connection", (socket) => {
  socket.emit("connection", "reads");
  socket.on("read", (data) => read(data, io));
  socket.on("write", (data) => write(data, io));
});
