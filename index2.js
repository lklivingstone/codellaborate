const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Connected");
  socket.on("send-changes", (delta) => {
    console.log("broadcasted");
    socket.broadcast.emit("receive-changes", delta);
  })
 //socket.on("send-mode-change", (data) => {
 //  console.log("broadcast mode", data);
 //  socket.broadcast.emit("reveive-mode-change", data);
 //})
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
