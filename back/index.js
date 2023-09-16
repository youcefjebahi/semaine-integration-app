const http = require("http");
const socketIo = require("socket.io");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json());

const coordinateurRoutes = require("./routes/coordinateurRoutes");
const equipeRoutes = require("./routes/equipeRoutes");
const etudiantRoutes = require("./routes/etudiantRoutes");
const salleRoutes = require("./routes/salleRoutes");
const tuteurRoutes = require("./routes/tuteurRoutes");
const membresComiteRoutes = require("./routes/membresComiteRoutes");
const dateRoutes = require("./routes/dateRoutes");

const authenticationRoute = require("./security/authentication");
const resetPassword = require("./security/resetPassword");
const adminAccount = require("./security/adminAccount");

const connectDB = require("./database");
adminAccount();
const cors = require("cors");

connectDB();
app.use(cors());

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/coordinateurs", coordinateurRoutes);
app.use("", authenticationRoute);
app.use("", resetPassword);
app.use("/equipes", equipeRoutes);
app.use("/etudiants", etudiantRoutes);
app.use("/salles", salleRoutes);
app.use("/tuteurs", tuteurRoutes);
app.use("/membresComite", membresComiteRoutes);
app.use("/date", dateRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
