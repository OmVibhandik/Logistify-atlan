require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.js");
const userRoutes = require("./routers/userRoutes.js");
const driverRoutes = require("./routers/driverRoutes.js");
const adminRoutes = require("./routers/adminRouters.js");
const setupWebSocket = require("../real-time/socketServer.js");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = setupWebSocket(server);
app.use(cors()); 
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/admins", adminRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
