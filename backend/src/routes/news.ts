import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Get all news
router.get("/", async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(news);
  } catch (error) {
    console.error("Get news error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all news for admin (including inactive)
router.get("/admin", auth, async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(news);
  } catch (error) {
    console.error("Get admin news error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single news
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.json(news);
  } catch (error) {
    console.error("Get news error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create news (admin only)
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, author, publishDate, imageUrl } = req.body;

    if (!title || !content || !author) {
      return res
        .status(400)
        .json({ message: "Title, content and author are required" });
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        author,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        imageUrl,
      },
    });

    res.status(201).json(news);
  } catch (error) {
    console.error("Create news error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update news (admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author, publishDate, imageUrl } = req.body;

    const news = await prisma.news.update({
      where: { id },
      data: {
        title,
        content,
        author,
        publishDate: publishDate ? new Date(publishDate) : undefined,
        imageUrl,
        updatedAt: new Date(),
      },
    });

    res.json(news);
  } catch (error) {
    console.error("Update news error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle news status (admin only)
router.patch("/:id/toggle", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        isActive: !news.isActive,
        updatedAt: new Date(),
      },
    });

    res.json(updatedNews);
  } catch (error) {
    console.error("Toggle news status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete news (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.news.delete({
      where: { id },
    });

    res.json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Delete news error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
