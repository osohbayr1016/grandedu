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
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      console.log("CORS: Request from origin:", origin);

      // Allow localhost for development
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        console.log("CORS: Allowing localhost");
        return callback(null, true);
      }

      // Allow Vercel deployments
      if (origin.includes("vercel.app")) {
        console.log("CORS: Allowing Vercel domain");
        return callback(null, true);
      }

      // Allow your custom domain
      if (origin.includes("grandedu.mn")) {
        console.log("CORS: Allowing grandedu.mn domain");
        return callback(null, true);
      }

      // Allow specific domains
      const allowed = [
        "https://grandedu-frontend.vercel.app",
        "https://grandedu.vercel.app",
        "https://grandedu.mn",
        "https://www.grandedu.mn",
        "http://grandedu.mn",
        "http://www.grandedu.mn",
      ];

      if (allowed.includes(origin)) {
        console.log("CORS: Allowing from allowed list:", origin);
        return callback(null, true);
      }

      console.log("CORS: Blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Handle preflight requests explicitly
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept, Origin, X-Requested-With"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

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
