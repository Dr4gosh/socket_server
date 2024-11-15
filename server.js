const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials if needed
  },
});

// app.get("/", (req, res) => {
//   res.send("<h1>Hello world</h1>");
// });

const corsOptions = {
  origin: "http://localhost:3000", // Change this to your frontend URL
  methods: ["GET", "POST"],
  optionsSuccessStatus: 200,
};

// Apply CORS middleware to Express
app.use(cors(corsOptions));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("test", (msg) => {
    console.log(`message: ${msg}`);
    socket.broadcast.emit("test", msg);
    // io.emit("test", msg);
  });

  // Handle custom events dynamically
  socket.onAny((eventName, data) => {
    console.log(`Received event: ${eventName}`, data);

    // Example: Check for specific event keys and process them
    if (
      eventName.startsWith("chat:") &&
      (eventName.endsWith(":messages:update") ||
        eventName.endsWith(":messages"))
    ) {
      // Handle update event
      console.log(`Handling update event with key: ${eventName}`);
      io.emit(eventName, data); // Broadcast or process the event
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});
