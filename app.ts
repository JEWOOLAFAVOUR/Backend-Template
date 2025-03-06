import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import "express-async-errors";
import "./db"; // Ensure this file is renamed to `index.ts`
import userRouter from "./routers/auth-route/userRoute";

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/user", userRouter);

// Error Handling Middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
