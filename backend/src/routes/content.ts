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

// Get footer content
router.get("/footer", async (req: Request, res: Response) => {
  try {
    const footerContent = await prisma.pageContent.findMany({
      where: {
        page: "footer",
        section: "footer",
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    // Group content by section and field
    const groupedContent = footerContent.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = {};
      }
      acc[item.section][item.field] = item.content;
      return acc;
    }, {} as Record<string, Record<string, string>>);

    res.json(groupedContent);
  } catch (error) {
    console.error("Error fetching footer content:", error);
    res.status(500).json({ error: "Failed to fetch footer content" });
  }
});

// Save footer content
router.post("/footer", auth, async (req: Request, res: Response) => {
  try {
    const footerData = req.body;
    const footerFields = [
      "companyDescription",
      "email",
      "phone",
      "address",
      "facebook",
      "instagram",
      "youtube",
      "privacyPolicy",
      "termsOfService",
      "copyright",
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

// Get university sections content (global fallback)
router.get("/university-sections", async (req: Request, res: Response) => {
  try {
    const universitySectionsContent = await prisma.pageContent.findMany({
      where: {
        page: "university",
        section: "universitySections",
        isActive: true,
        // No universityId filter means global content
        field: { not: { contains: "_" } }, // Legacy global content without university ID suffix
      },
      orderBy: {
        order: "asc",
      },
    });

    // Group content by section and field
    const groupedContent = universitySectionsContent.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = {};
      }
      acc[item.section][item.field] = item.content;
      return acc;
    }, {} as Record<string, Record<string, string>>);

    res.json(groupedContent);
  } catch (error) {
    console.error("Error fetching university sections content:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch university sections content" });
  }
});

// Get university sections content for specific university
router.get(
  "/university-sections/:universityId",
  async (req: Request, res: Response) => {
    try {
      const { universityId } = req.params;

      const universitySectionsContent = await prisma.pageContent.findMany({
        where: {
          page: "university",
          section: "universitySections",
          isActive: true,
          field: {
            contains: `_${universityId}`, // Field names like "programsTitle_universityId"
          },
        },
        orderBy: {
          order: "asc",
        },
      });

      // Group content by section and field, removing the university ID suffix
      const groupedContent = universitySectionsContent.reduce((acc, item) => {
        if (!acc[item.section]) {
          acc[item.section] = {};
        }
        // Remove the "_universityId" suffix from field name
        const fieldName = item.field.replace(`_${universityId}`, "");
        acc[item.section][fieldName] = item.content;
        return acc;
      }, {} as Record<string, Record<string, string>>);

      res.json(groupedContent);
    } catch (error) {
      console.error(
        "Error fetching university-specific sections content:",
        error
      );
      res.status(500).json({
        error: "Failed to fetch university-specific sections content",
      });
    }
  }
);

// Save university sections content (global fallback)
router.post(
  "/university-sections",
  auth,
  async (req: Request, res: Response) => {
    try {
      const universitySectionsData = req.body;
      const universitySectionsFields = [
        "programsTitle",
        "programsDescription",
        "programsAdminNote",
        "admissionRequirementsTitle",
        "admissionRequirementsDescription",
        "cityLifeTitle",
        "cityLifeDescription",
      ];

      // Save each university section field as a separate content entry (global)
      const promises = universitySectionsFields.map(async (field) => {
        if (universitySectionsData[field] !== undefined) {
          const existingContent = await prisma.pageContent.findFirst({
            where: {
              page: "university",
              section: "universitySections",
              field: field,
            },
          });

          if (existingContent) {
            // Update existing content
            return await prisma.pageContent.update({
              where: { id: existingContent.id },
              data: {
                content: universitySectionsData[field],
                updatedAt: new Date(),
              },
            });
          } else {
            // Create new content
            return await prisma.pageContent.create({
              data: {
                page: "university",
                section: "universitySections",
                field: field,
                content: universitySectionsData[field],
                type: "text",
                order: 0,
              },
            });
          }
        }
      });

      await Promise.all(promises);
      res.json({ message: "University sections content saved successfully" });
    } catch (error) {
      console.error("Error saving university sections content:", error);
      res
        .status(500)
        .json({ error: "Failed to save university sections content" });
    }
  }
);

// Save university sections content for specific university
router.post(
  "/university-sections/:universityId",
  auth,
  async (req: Request, res: Response) => {
    try {
      const { universityId } = req.params;
      const universitySectionsData = req.body;
      const universitySectionsFields = [
        "programsTitle",
        "programsDescription",
        "programsAdminNote",
        "admissionRequirementsTitle",
        "admissionRequirementsDescription",
        "cityLifeTitle",
        "cityLifeDescription",
      ];

      // Save each university section field as a separate content entry with university ID suffix
      const promises = universitySectionsFields.map(async (field) => {
        if (universitySectionsData[field] !== undefined) {
          const fieldWithUniversityId = `${field}_${universityId}`;
          const existingContent = await prisma.pageContent.findFirst({
            where: {
              page: "university",
              section: "universitySections",
              field: fieldWithUniversityId,
            },
          });

          if (existingContent) {
            // Update existing content
            return await prisma.pageContent.update({
              where: { id: existingContent.id },
              data: {
                content: universitySectionsData[field],
                updatedAt: new Date(),
              },
            });
          } else {
            // Create new content
            return await prisma.pageContent.create({
              data: {
                page: "university",
                section: "universitySections",
                field: fieldWithUniversityId,
                content: universitySectionsData[field],
                type: "text",
                order: 0,
              },
            });
          }
        }
      });

      await Promise.all(promises);
      res.json({
        message: "University-specific sections content saved successfully",
      });
    } catch (error) {
      console.error(
        "Error saving university-specific sections content:",
        error
      );
      res
        .status(500)
        .json({ error: "Failed to save university-specific sections content" });
    }
  }
);

// Delete university-specific sections content (reset to defaults)
router.delete(
  "/university-sections/:universityId",
  auth,
  async (req: Request, res: Response) => {
    try {
      const { universityId } = req.params;

      // Delete all university-specific content entries
      await prisma.pageContent.deleteMany({
        where: {
          page: "university",
          section: "universitySections",
          field: {
            contains: `_${universityId}`,
          },
        },
      });

      res.json({
        message: "University-specific sections content deleted successfully",
      });
    } catch (error) {
      console.error(
        "Error deleting university-specific sections content:",
        error
      );
      res.status(500).json({
        error: "Failed to delete university-specific sections content",
      });
    }
  }
);

export default router;
