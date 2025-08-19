import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Get all programs
router.get("/", async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(programs);
  } catch (error) {
    console.error("Get programs error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all programs for admin (including inactive)
router.get("/admin", async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(programs);
  } catch (error) {
    console.error("Get admin programs error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single program
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const program = await prisma.program.findUnique({
      where: { id },
    });

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json(program);
  } catch (error) {
    console.error("Get program error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create program (admin only)
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      level,
      price,
      location,
      university,
      requirements,
      imageUrl,
      googleFormLink,
      adminNote,
    } = req.body;

    if (!title || !description || !duration) {
      return res
        .status(400)
        .json({ message: "Title, description and duration are required" });
    }

    const program = await prisma.program.create({
      data: {
        title,
        description,
        duration,
        level: level || "Бакалавр",
        price,
        location,
        university,
        requirements,
        imageUrl,
        googleFormLink,
        adminNote: adminNote || null,
      },
    });

    res.status(201).json(program);
  } catch (error) {
    console.error("Create program error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update program (admin only)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      duration,
      level,
      price,
      location,
      university,
      requirements,
      imageUrl,
      googleFormLink,
      adminNote,
    } = req.body;

    const program = await prisma.program.update({
      where: { id },
      data: {
        title,
        description,
        duration,
        level,
        price,
        location,
        university,
        requirements,
        imageUrl,
        googleFormLink,
        adminNote: adminNote || null,
        updatedAt: new Date(),
      },
    });

    res.json(program);
  } catch (error) {
    console.error("Update program error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle program status (admin only)
router.patch("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;

    const program = await prisma.program.findUnique({
      where: { id },
    });

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const updatedProgram = await prisma.program.update({
      where: { id },
      data: {
        isActive: !program.isActive,
        updatedAt: new Date(),
      },
    });

    res.json(updatedProgram);
  } catch (error) {
    console.error("Toggle program status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle program highlight status (admin only)
router.patch("/:id/highlight", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const program = await prisma.program.findUnique({
      where: { id },
    });

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const updatedProgram = await prisma.program.update({
      where: { id },
      data: {
        isHighlighted: !program.isHighlighted,
        updatedAt: new Date(),
      },
    });

    res.json(updatedProgram);
  } catch (error) {
    console.error("Toggle program highlight error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete program (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.program.delete({
      where: { id },
    });

    res.json({ message: "Program deleted successfully" });
  } catch (error) {
    console.error("Delete program error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
