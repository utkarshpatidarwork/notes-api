//server.js
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

const http = require("http");

const { Server } =
  require("socket.io");

const server =
  http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://notes-frontend-6q9f.onrender.com"
    ]
  }
});

app.set("io", io);

io.on("connection", (socket) => {

  socket.on(
    "joinWorkspace",
    (workspaceId) => {

      socket.join(workspaceId);
    }
  );

  socket.on(
    "leaveWorkspace",
    (workspaceId) => {

      socket.leave(workspaceId);
    }
  );

});

server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});