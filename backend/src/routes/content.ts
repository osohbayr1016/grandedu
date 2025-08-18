import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Get all content for a specific page
router.get("/:page", async (req: Request, res: Response) => {
  try {
    const { page } = req.params;
    const content = await prisma.pageContent.findMany({
      where: {
        page: page,
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    // Group content by section
    const groupedContent = content.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = {};
      }
      acc[item.section][item.field] = item.content;
      return acc;
    }, {} as Record<string, Record<string, string>>);

    res.json(groupedContent);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

// Get all content (admin view)
router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const content = await prisma.pageContent.findMany({
      orderBy: [{ page: "asc" }, { section: "asc" }, { order: "asc" }],
    });
    res.json(content);
  } catch (error) {
    console.error("Error fetching all content:", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

// Create or update content
router.post("/", auth, async (req: Request, res: Response) => {
  try {
    const {
      page,
      section,
      field,
      content,
      type = "text",
      order = 0,
    } = req.body;

    if (!page || !section || !field || content === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingContent = await prisma.pageContent.findFirst({
      where: {
        page,
        section,
        field,
      },
    });

    let result;
    if (existingContent) {
      // Update existing content
      result = await prisma.pageContent.update({
        where: { id: existingContent.id },
        data: {
          content,
          type,
          order,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new content
      result = await prisma.pageContent.create({
        data: {
          page,
          section,
          field,
          content,
          type,
          order,
        },
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Error saving content:", error);
    res.status(500).json({ error: "Failed to save content" });
  }
});

// Delete content
router.delete("/:id", auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.pageContent.delete({
      where: { id },
    });
    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ error: "Failed to delete content" });
  }
});

// Toggle content active status
router.patch("/:id/toggle", auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const content = await prisma.pageContent.findUnique({
      where: { id },
    });

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    const updatedContent = await prisma.pageContent.update({
      where: { id },
      data: {
        isActive: !content.isActive,
      },
    });

    res.json(updatedContent);
  } catch (error) {
    console.error("Error toggling content:", error);
    res.status(500).json({ error: "Failed to toggle content" });
  }
});

// Save footer content
router.post("/footer", auth, async (req: Request, res: Response) => {
  try {
    const footerData = req.body;
    const footerFields = [
      'companyDescription',
      'email', 
      'phone',
      'address',
      'facebook',
      'instagram', 
      'youtube',
      'privacyPolicy',
      'termsOfService',
      'copyright'
    ];

    // Save each footer field as a separate content entry
    const promises = footerFields.map(async (field) => {
      if (footerData[field] !== undefined) {
        const existingContent = await prisma.pageContent.findFirst({
          where: {
            page: "footer",
            section: "footer",
            field: field,
          },
        });

        if (existingContent) {
          // Update existing content
          return await prisma.pageContent.update({
            where: { id: existingContent.id },
            data: {
              content: footerData[field],
              updatedAt: new Date(),
            },
          });
        } else {
          // Create new content
          return await prisma.pageContent.create({
            data: {
              page: "footer",
              section: "footer", 
              field: field,
              content: footerData[field],
              type: "text",
              order: 0,
            },
          });
        }
      }
    });

    await Promise.all(promises);
    res.json({ message: "Footer content saved successfully" });
  } catch (error) {
    console.error("Error saving footer content:", error);
    res.status(500).json({ error: "Failed to save footer content" });
  }
});

export default router;
