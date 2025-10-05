import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Get all active courses (public endpoint)
router.get("/", async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { isHighlighted: "desc" }, // Highlighted courses first
        { createdAt: "desc" }, // Then by creation date
      ],
    });

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// Get all courses for admin (including inactive)
router.get("/admin", async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [
        { isHighlighted: "desc" },
        { createdAt: "desc" },
      ],
    });

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses for admin:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// Create a new course (admin only)
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      duration,
      level,
      price,
      instructor,
      schedule,
      requirements,
      imageUrl,
      registrationLink,
      adminNote,
      isActive,
      isHighlighted,
    } = req.body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        duration,
        level: level || "Энгийн",
        price,
        instructor,
        schedule,
        requirements,
        imageUrl,
        registrationLink,
        adminNote,
        isActive: isActive !== undefined ? isActive : true,
        isHighlighted: isHighlighted !== undefined ? isHighlighted : false,
      },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
});

// Update a course (admin only)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      duration,
      level,
      price,
      instructor,
      schedule,
      requirements,
      imageUrl,
      registrationLink,
      adminNote,
      isActive,
      isHighlighted,
    } = req.body;

    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        duration,
        level,
        price,
        instructor,
        schedule,
        requirements,
        imageUrl,
        registrationLink,
        adminNote,
        isActive,
        isHighlighted,
      },
    });

    res.json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
});

// Delete a course (admin only)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.course.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
});

// Get a single course by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

export default router;
