import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import programRoutes from "./routes/programs";
import contentRoutes from "./routes/content";
import newsRoutes from "./routes/news";
import universitiesRoutes from "./routes/universities";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/universities", universitiesRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to GrandEdu Backend API" });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
