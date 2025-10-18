import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

// Save a course (authenticated users only)
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
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if already saved
    const existingSave = await prisma.savedCourse.findUnique({
      where: {
        userId_courseId: {
          userId: decoded.userId,
          courseId: courseId,
        },
      },
    });

    if (existingSave) {
      return res.status(400).json({ message: "Course already saved" });
    }

    // Save the course
    const savedCourse = await prisma.savedCourse.create({
      data: {
        userId: decoded.userId,
        courseId: courseId,
      },
      include: {
        course: true,
      },
    });

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Save course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user's saved courses
router.get("/my-saved", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const savedCourses = await prisma.savedCourse.findMany({
      where: { userId: decoded.userId },
      include: {
        course: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(savedCourses);
  } catch (error) {
    console.error("Get saved courses error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Check if course is saved by current user
router.get("/check/:courseId", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.json({ isSaved: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const { courseId } = req.params;

    const savedCourse = await prisma.savedCourse.findUnique({
      where: {
        userId_courseId: {
          userId: decoded.userId,
          courseId: courseId,
        },
      },
    });

    res.json({ isSaved: !!savedCourse });
  } catch (error) {
    console.error("Check saved course error:", error);
    res.json({ isSaved: false });
  }
});

// Unsave a course
router.delete("/:courseId", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const { courseId } = req.params;

    const savedCourse = await prisma.savedCourse.findUnique({
      where: {
        userId_courseId: {
          userId: decoded.userId,
          courseId: courseId,
        },
      },
    });

    if (!savedCourse) {
      return res.status(404).json({ message: "Saved course not found" });
    }

    await prisma.savedCourse.delete({
      where: {
        userId_courseId: {
          userId: decoded.userId,
          courseId: courseId,
        },
      },
    });

    res.json({ message: "Course unsaved successfully" });
  } catch (error) {
    console.error("Unsave course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
