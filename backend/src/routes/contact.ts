import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Submit contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Нэр, имэйл, мессеж заавал оруулах ёстой",
      });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || "",
        message,
      },
    });

    res.status(201).json({
      message: "Мэдээлэл амжилттай илгээгдлээ",
      data: contactMessage,
    });
  } catch (error) {
    console.error("Submit contact form error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all contact messages (admin only)
router.get("/messages", auth, async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(messages);
  } catch (error) {
    console.error("Get contact messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single contact message (admin only)
router.get("/messages/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ message: "Мэдээлэл олдсонгүй" });
    }

    res.json(message);
  } catch (error) {
    console.error("Get contact message error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark message as read (admin only)
router.patch("/messages/:id/read", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ message: "Мэдээлэл олдсонгүй" });
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: {
        isRead: true,
        updatedAt: new Date(),
      },
    });

    res.json(updatedMessage);
  } catch (error) {
    console.error("Mark message as read error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete contact message (admin only)
router.delete("/messages/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ message: "Мэдээлэл олдсонгүй" });
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    res.json({ message: "Мэдээлэл амжилттай устгагдлаа" });
  } catch (error) {
    console.error("Delete contact message error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
