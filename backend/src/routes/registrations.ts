import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

// Register for a course (authenticated users only)
router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const { courseId, notes } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Check if course exists and is active
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.isActive) {
      return res.status(400).json({ message: "Course is not active" });
    }

    // Check if user is already registered
    const existingRegistration = await prisma.courseRegistration.findUnique({
      where: {
        userId_courseId: {
          userId: decoded.userId,
          courseId: courseId,
        },
      },
    });

    if (existingRegistration) {
      return res
        .status(400)
        .json({ message: "You are already registered for this course" });
    }

    // Create registration
    const registration = await prisma.courseRegistration.create({
      data: {
        userId: decoded.userId,
        courseId: courseId,
        notes: notes || null,
        status: "pending",
      },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            userCode: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error("Course registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user's registrations
router.get("/my-registrations", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const registrations = await prisma.courseRegistration.findMany({
      where: { userId: decoded.userId },
      include: {
        course: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(registrations);
  } catch (error) {
    console.error("Get user registrations error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all registrations (admin only)
router.get("/all", auth, async (req, res) => {
  try {
    const registrations = await prisma.courseRegistration.findMany({
      include: {
        course: true,
        user: {
          select: {
            id: true,
            userCode: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(registrations);
  } catch (error) {
    console.error("Get all registrations error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update registration status (admin only)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const registration = await prisma.courseRegistration.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            userCode: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    res.json(registration);
  } catch (error) {
    console.error("Update registration status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete registration
router.delete("/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const { id } = req.params;

    // Get the registration
    const registration = await prisma.courseRegistration.findUnique({
      where: { id },
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Check if user owns this registration or is admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (registration.userId !== decoded.userId && user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.courseRegistration.delete({
      where: { id },
    });

    res.json({ message: "Registration deleted successfully" });
  } catch (error) {
    console.error("Delete registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
