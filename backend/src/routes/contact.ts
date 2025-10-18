import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";
import { sendEmailWithFallback } from "../utils/emailService";

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

    // Send email notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

      if (adminEmail) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Шинэ холбоо барих мэдээлэл</h2>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Нэр:</strong> ${name}</p>
              <p><strong>Имэйл:</strong> ${email}</p>
              <p><strong>Утас:</strong> ${phone || "Оруулаагүй"}</p>
              <p><strong>Мессеж:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #6b7280; font-size: 12px;">
              Энэ мэдээлэл GrandEdu вэбсайтын холбоо барих хэсгээс ирсэн.
            </p>
          </div>
        `;

        await sendEmailWithFallback({
          to: adminEmail,
          subject: `Шинэ холбоо барих мэдээлэл - ${name}`,
          html: emailHtml,
        });

        console.log("Contact form notification email sent to admin");
      }
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error("Failed to send contact notification email:", emailError);
    }

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
