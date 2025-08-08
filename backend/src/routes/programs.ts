import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Get all programs
router.get("/", async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(programs);
  } catch (error) {
    console.error("Get programs error:", error);
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
      price,
      location,
      university,
      requirements,
      imageUrl,
    } = req.body;

    if (
      !title ||
      !description ||
      !duration ||
      !price ||
      !location ||
      !university ||
      !requirements
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const program = await prisma.program.create({
      data: {
        title,
        description,
        duration,
        price: price.toString(),
        location,
        university,
        requirements,
        imageUrl,
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
      price,
      location,
      university,
      requirements,
      imageUrl,
    } = req.body;

    const program = await prisma.program.update({
      where: { id },
      data: {
        title,
        description,
        duration,
        price: price.toString(),
        location,
        university,
        requirements,
        imageUrl,
      },
    });

    res.json(program);
  } catch (error) {
    console.error("Update program error:", error);
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
