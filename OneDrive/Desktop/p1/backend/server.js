const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");

const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");
const slaRoutes = require("./routes/sla");
const knowledgeBaseRoutes = require("./routes/knowledgeBase");
const articleRoutes = require("./routes/articles");
const userRoutes = require("./routes/users");
const { createDefaultSLAs, checkSLABreaches } = require("./controllers/slaController");
const NotificationService = require("./services/notificationService");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Initialize notification service
const notificationService = new NotificationService(io);

// Make io and notification service accessible to routes
app.use((req, res, next) => {
    req.io = io;
    req.notificationService = notificationService;
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/sla", slaRoutes);
app.use("/api/knowledge", knowledgeBaseRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("MongoDB connected");
    // Initialize default SLAs
    await createDefaultSLAs();
    
    // Set up SLA breach checking every 5 minutes
    setInterval(async () => {
        const breaches = await checkSLABreaches();
        if (breaches && breaches.totalBreaches > 0) {
            console.log(`SLA Check: ${breaches.totalBreaches} breaches found`);
        }
    }, 5 * 60 * 1000); // 5 minutes
}).catch(err => console.log(err));

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Join user to their own room for personalized notifications
    socket.on('join', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined their room`);
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3011;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
