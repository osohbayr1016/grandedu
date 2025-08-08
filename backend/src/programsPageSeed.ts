import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedProgramsPageContent() {
  try {
    console.log("Seeding programs page content...");

    // Clear existing programs page content
    await prisma.pageContent.deleteMany({
      where: { page: "programs" },
    });

    const programsPageContent = [
      // Header section
      {
        page: "programs",
        section: "header",
        field: "title",
        content: "Хөтөлбөрүүд",
        type: "text",
        order: 1,
        isActive: true,
      },
      {
        page: "programs",
        section: "header",
        field: "description",
        content: "Хятадын их сургуулиудад суралцах боломжийг сонгоно уу",
        type: "text",
        order: 2,
        isActive: true,
      },

      // Programs section
      {
        page: "programs",
        section: "programs",
        field: "requirementsLabel",
        content: "Шаардлага:",
        type: "text",
        order: 1,
        isActive: true,
      },
      {
        page: "programs",
        section: "programs",
        field: "applyButton",
        content: "Хүсэлт илгээх",
        type: "text",
        order: 2,
        isActive: true,
      },

      // Empty state
      {
        page: "programs",
        section: "empty",
        field: "message",
        content: "Одоогоор хөтөлбөр байхгүй байна",
        type: "text",
        order: 1,
        isActive: true,
      },
    ];

    for (const content of programsPageContent) {
      await prisma.pageContent.create({ data: content });
    }

    console.log("Programs page content seeded successfully!");
  } catch (error) {
    console.error("Error seeding programs page content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProgramsPageContent();
