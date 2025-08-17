import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Get all universities
router.get("/", async (req, res) => {
  try {
    const universities = await prisma.university.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(universities);
  } catch (error) {
    console.error("Get universities error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all universities for admin (including inactive)
router.get("/admin", auth, async (req, res) => {
  try {
    const universities = await prisma.university.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(universities);
  } catch (error) {
    console.error("Get admin universities error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single university
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const university = await prisma.university.findUnique({
      where: { id },
    });

    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    res.json(university);
  } catch (error) {
    console.error("Get university error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create university (admin only)
router.post("/", auth, async (req, res) => {
  try {
    const { name, location, description, imageUrl } = req.body;

    if (!name || !location) {
      return res
        .status(400)
        .json({ message: "Name and location are required" });
    }

    const university = await prisma.university.create({
      data: {
        name,
        location,
        description: description || "",
        imageUrl,
      },
    });

    res.status(201).json(university);
  } catch (error) {
    console.error("Create university error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update university (admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, description, imageUrl } = req.body;

    const university = await prisma.university.update({
      where: { id },
      data: {
        name,
        location,
        description,
        imageUrl,
        updatedAt: new Date(),
      },
    });

    res.json(university);
  } catch (error) {
    console.error("Update university error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle university status (admin only)
router.patch("/:id/toggle", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const university = await prisma.university.findUnique({
      where: { id },
    });

    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    const updatedUniversity = await prisma.university.update({
      where: { id },
      data: {
        isActive: !university.isActive,
        updatedAt: new Date(),
      },
    });

    res.json(updatedUniversity);
  } catch (error) {
    console.error("Toggle university status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete university (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.university.delete({
      where: { id },
    });

    res.json({ message: "University deleted successfully" });
  } catch (error) {
    console.error("Delete university error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
