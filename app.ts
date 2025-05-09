import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import "express-async-errors";
import helmet from "helmet";
import compression from "compression";
import pino from "pino";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import authRouter from "./routers/auth-route/userRoute";
import "./db";

const expressSanitizer = require("express-sanitizer");

dotenv.config();

const requiredEnvVars = ["JWT_SECRET", "NODE_ENV"];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`⚠️ Required environment variable ${envVar} is not set!`);
    process.exit(1);
  }
});

// Initialize Express app
const app = express();

// Setup logging
const isProduction = process.env.NODE_ENV === "production";
const logDir = path.join(__dirname, "./logs");

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configure file logger that works in all environments
const logFile = path.join(logDir, "app.log");
const fileStream = fs.createWriteStream(logFile, { flags: "a" });

// Create a simple file logger for Morgan
const morganFileLogger = {
  write: (message: string) => {
    fileStream.write(message);
  },
};

// Original Pino logger
const pinoLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: !isProduction ? { target: "pino-pretty" } : undefined,
});

// Create a wrapper logger that also writes to file

const logger = {
  info: (...args: any[]) => {
    const message =
      args.length > 0 ? args[0].toString() : "No message provided";
    return pinoLogger.info(message, ...args.slice(1));
  },

  error: (...args: any[]) => {
    const message =
      args.length > 0 ? args[0].toString() : "No message provided";
    return pinoLogger.error(message, ...args.slice(1));
  },

  warn: (...args: any[]) => {
    const message =
      args.length > 0 ? args[0].toString() : "No message provided";
    return pinoLogger.warn(message, ...args.slice(1));
  },

  debug: (...args: any[]) => {
    const message =
      args.length > 0 ? args[0].toString() : "No message provided";
    return pinoLogger.debug(message, ...args.slice(1));
  },

  trace: (...args: any[]) => {
    const message =
      args.length > 0 ? args[0].toString() : "No message provided";
    return pinoLogger.trace(message, ...args.slice(1));
  },

  fatal: (...args: any[]) => {
    const message =
      args.length > 0 ? args[0].toString() : "No message provided";
    return pinoLogger.fatal(message, ...args.slice(1));
  },
};

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
  skipSuccessfulRequests: false, // Count all requests
});

// More aggressive rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
});

// Configure CORS options
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-Request-ID"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Extend Express Request type to include requestId
declare module "express-serve-static-core" {
  interface Request {
    requestId: string;
  }
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(
  helmet({
    contentSecurityPolicy: isProduction ? undefined : false,
    crossOriginEmbedderPolicy: isProduction,
  })
);
app.use(compression());
app.use(expressSanitizer());

// Add request ID to each request
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers["x-request-id"] || uuidv4();
  req.requestId = requestId.toString();
  res.setHeader("X-Request-ID", req.requestId);
  next();
});

// Use Morgan for console logging
app.use(morgan(":method :url :status :response-time ms"));

// Also log HTTP requests to file
app.use(
  morgan(":method :url :status :response-time ms", {
    stream: morganFileLogger,
  })
);

// Global rate limiter
app.use(limiter);

// Apply specific rate limits to auth routes
app.use("/api/v1/auth", authLimiter);

// Health check endpoint (no authentication required)
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
});

// Error handling middleware - fixed TypeScript error
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Invalid token or not authenticated" });
  } else {
    next(err);
  }
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message} (${req.method} ${req.originalUrl})`);

  const statusCode = "statusCode" in err ? (err as any).statusCode : 500;

  res.status(statusCode).json({
    error:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
    requestId: req.requestId,
  });
});

// api request
app.use("/api/v1/auth", authRouter);

// Handle 404 routes
app.use((req: Request, res: Response) => {
  res
    .status(404)
    .json({ error: "Route not found", message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(
    `🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  fileStream.write(
    `[${new Date().toISOString()}] FATAL: Uncaught Exception: ${err.message}\n${
      err.stack
    }\n`
  );
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  fileStream.write(
    `[${new Date().toISOString()}] FATAL: Unhandled Rejection: ${reason}\n`
  );
  process.exit(1);
});

export default app;
