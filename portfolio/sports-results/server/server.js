const path = require("path");

/* ENV */
require("dotenv").config({
    path: path.join(__dirname, "./configs/server.env"),
});
require("dotenv").config({
    path: path.join(__dirname, "./configs/db.env"),
});

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const db = require("./middlewares/db_connection");

const PORT = 3000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

global.io = io;
io.use((socket, next) => {
    const adminToken = socket.handshake.auth?.adminToken;
    const publicKey = socket.handshake.auth?.publicKey;

    if (adminToken && process.env.ADMIN_TOKEN && adminToken === process.env.ADMIN_TOKEN) {
        socket.role = "admin";
        return next();
    }

    if (publicKey && process.env.PUBLIC_API_KEY && publicKey === process.env.PUBLIC_API_KEY) {
        socket.role = "public";
        return next();
    }

    return next(new Error("Unauthorized socket"));
});

io.on("connection", (socket) => {
    console.log(`🟢 Socket connected (${socket.role}) : ${socket.id}`);

    socket.emit("status", {
        message: "Real-time connected",
        role: socket.role
    });

    socket.on("disconnect", () => {
        console.log(`🔴 Socket disconnected : ${socket.id}`);
    });
});


(async () => {
    try {
        await db.getConnection();
        server.listen(PORT, () => {
            console.log(`🔷 Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ Database init failed:", err.message);
    }
})();