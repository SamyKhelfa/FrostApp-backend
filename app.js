const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const programRoutes = require("./routes/programRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/programs");

app.use("/programs", programRoutes);

// Créez un serveur HTTP à partir de l'application Express
const server = http.createServer(app);

// Intégrez Socket.io avec le serveur HTTP
const io = socketIo(server);

// Gestion des connexions Socket.io
io.on("connection", (socket) => {
  console.log("Un client est connecté");

  socket.on("disconnect", () => {
    console.log("Client déconnecté");
  });

  // Gestion des messages de chat
  socket.on("chat message", (msg) => {
    console.log("Message reçu: " + msg);
    // Émettre le message à tous les clients connectés
    io.emit("chat message", msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
