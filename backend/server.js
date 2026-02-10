import dotenv from "dotenv";
dotenv.config(); // Must be first!

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import http from "http";
import { dbconnect } from "./config/db.js";
import servicesRouter from "./routes/services.js";
import projectsRouter from "./routes/projects.js";
import clientsRouter from "./routes/clients.js";
import inquiriesRouter from "./routes/inquiries.js";
import applicationsRouter from "./routes/applications.js";
import faqRouter from "./routes/faq.js";
import bookingsRouter from "./routes/bookings.js";
import workOrdersRouter from "./routes/workOrders.js";
import feedbackRouter from "./routes/feedbackRoutes.js";
import passport from "passport";
import session from "express-session";
import configurePassport from "./config/passport.js"; // Import function
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Trust proxy for secure cookies on Render/Heroku
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

const NODE_ENV = process.env.NODE_ENV || "development";

// Initialize Passport config
configurePassport();
const isProduction = NODE_ENV === "production";
const debugLog = (...args) => {
    if (!isProduction) console.log(...args);
};
const port = process.env.PORT || 5000;

const server = http.createServer(app);

// CORS: allow only configured origins in production
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "*")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
    
debugLog('Configured allowed origins:', allowedOrigins);

// In production, ensure we accept requests from the web frontend
if (NODE_ENV === 'production') {
    // Force add the web frontend domains if not already included
    const webFrontendDomains = [
        'https://safetyc-web.onrender.com',
        'https://safetyc.in',
        'https://www.safetyc.in'
    ];
    
    webFrontendDomains.forEach(domain => {
        if (!allowedOrigins.includes('*') && !allowedOrigins.includes(domain)) {
            allowedOrigins.push(domain);
            debugLog('Added web frontend domain to allowed origins:', domain);
        }
    });
}

app.use(
    cors({
        origin: (origin, callback) => {
            // Log incoming origin for debugging
            debugLog('Request from origin:', origin);
            
            // Allow requests with no origin (like mobile apps, curl requests)
            if (!origin) {
                debugLog('Allowing request with no origin');
                return callback(null, true);
            }
            
            // Allow any origin if "*" is in allowed origins
            if (allowedOrigins.includes("*")) {
                debugLog('Allowing all origins due to wildcard configuration');
                return callback(null, true);
            }
            
            // Check if origin is allowed
            if (allowedOrigins.includes(origin)) {
                debugLog('Origin explicitly allowed:', origin);
                return callback(null, true);
            }
            
            // Origin not allowed
            debugLog('Origin rejected by CORS policy:', origin);
            return callback(new Error(`Not allowed by CORS: ${origin}`));
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

// Session config
app.use(
  session({
    secret: process.env.SESSION_SECRET || "safetyc-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (_req, res) => res.json({ ok: true, name: "safetyc API" }));

// Add an explicit route for API status check
app.get("/api", (_req, res) => res.json({ 
    status: "ok", 
    message: "safetyc API is running", 
    version: "1.0.0",
    environment: NODE_ENV
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRouter)
app.use("/api/projects", projectsRouter)
app.use("/api/clients", clientsRouter)
app.use("/api/inquiries", inquiriesRouter)
app.use("/api/applications", applicationsRouter)
app.use("/api/faq", faqRouter)
app.use("/api/bookings", bookingsRouter)
app.use("/api/work-orders", workOrdersRouter)
app.use("/api/feedback", feedbackRouter)


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
    console.error("Server error from server.js", err);
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








