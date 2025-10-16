import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import http from "http";
import { dbconnect } from "./config/db.js";
import servicesRouter from "./routes/services.js";
import projectsRouter from "./routes/projects.js";
import clientsRouter from "./routes/clients.js";
import inquiriesRouter from "./routes/inquiries.js";
import applicationsRouter from "./routes/applications.js";



dotenv.config();

const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";
const port = process.env.PORT || 5000;

const server = http.createServer(app);

// CORS: allow only configured origins in production
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "*")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
app.use(
    cors({
        origin: (origin, callback) => {
            if (allowedOrigins.includes("*") || !origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

// Security headers
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);

// Body parser with sane limits
app.use(express.json({ limit: "1mb" }));

// Logging
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// Basic rate limiting for API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // adjust per needs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.get("/", (_req, res) => res.json({ ok: true, name: "Safetyc API" }));

app.use("/api/services", servicesRouter)
app.use("/api/projects", projectsRouter)
app.use("/api/clients", clientsRouter)
app.use("/api/inquiries", inquiriesRouter)
app.use("/api/applications", applicationsRouter)


dbconnect()
    .then(() => {
        server.listen(port, () =>
            console.log(`server is listening on port ${port} (${NODE_ENV})`)
        );
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1);
    });


server.on('error', (err)=>{
    console.log(err, "server error from server.js")
})

// 404 handler
app.use((req, res, _next) => {
    res.status(404).json({ error: "Not Found" });
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

// Graceful shutdown
const shutdown = () => {
    console.log("Shutting down server...");
    server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);








