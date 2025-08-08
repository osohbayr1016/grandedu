import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedProgramsPageCompleteContent() {
  try {
    console.log("Seeding complete programs page content...");

    // Delete existing content for these sections
    await prisma.pageContent.deleteMany({
      where: {
        page: {
          in: ["programs", "navigation", "header", "empty", "auth", "modal"],
        },
      },
    });

    const allContent = [
      // Navigation content
      {
        page: "navigation",
        section: "navigation",
        field: "logo",
        content: "GrandEdu",
        type: "text",
        order: 1,
        isActive: true,
      },
      {
        page: "navigation",
        section: "navigation",
        field: "homeLink",
        content: "Нүүр",
        type: "text",
        order: 2,
        isActive: true,
      },
      {
        page: "navigation",
        section: "navigation",
        field: "programsLink",
        content: "Хөтөлбөрүүд",
        type: "text",
        order: 3,
        isActive: true,
      },
      {
        page: "navigation",
        section: "navigation",
        field: "welcomeMessage",
        content: "Сайн байна уу, {firstName}!",
        type: "text",
        order: 4,
        isActive: true,
      },
      {
        page: "navigation",
        section: "navigation",
        field: "adminButton",
        content: "Admin Panel",
        type: "text",
        order: 5,
        isActive: true,
      },
      {
        page: "navigation",
        section: "navigation",
        field: "logoutButton",
        content: "Гарах",
        type: "text",
        order: 6,
        isActive: true,
      },
      {
        page: "navigation",
        section: "navigation",
        field: "loginButton",
        content: "Нэвтрэх",
        type: "text",
        order: 7,
        isActive: true,
      },

      // Programs page header content
      {
        page: "programs",
        section: "header",
        field: "badge",
        content: "Хөтөлбөрүүд",
        type: "text",
        order: 1,
        isActive: true,
      },
      {
        page: "programs",
        section: "header",
        field: "title",
        content: "Хөтөлбөрүүд",
        type: "text",
        order: 2,
        isActive: true,
      },
      {
        page: "programs",
        section: "header",
        field: "description",
        content: "Хятадын их сургуулиудад суралцах боломжийг сонгоно уу",
        type: "text",
        order: 3,
        isActive: true,
      },

      // Programs section content
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
      {
        page: "programs",
        section: "programs",
        field: "fallbackImageText",
        content: "Хөтөлбөр",
        type: "text",
        order: 3,
        isActive: true,
      },

      // Empty state content
      {
        page: "programs",
        section: "empty",
        field: "title",
        content: "Хөтөлбөр олдсонгүй",
        type: "text",
        order: 1,
        isActive: true,
      },
      {
        page: "programs",
        section: "empty",
        field: "message",
        content: "Одоогоор хөтөлбөр байхгүй байна",
        type: "text",
        order: 2,
        isActive: true,
      },

      // Authentication modal content
      {
        page: "programs",
        section: "auth",
        field: "loginTitle",
        content: "Нэвтрэх",
        type: "text",
        order: 1,
        isActive: true,
      },
      {
        page: "programs",
        section: "auth",
        field: "signupTitle",
        content: "Бүртгүүлэх",
        type: "text",
        order: 2,
        isActive: true,
      },
      {
        page: "programs",
        section: "auth",
        field: "loginSubtitle",
        content: "Бүртгэлээ ашиглан нэвтэрнэ үү",
        type: "text",
        order: 3,
        isActive: true,
      },
      {
        page: "programs",
        section: "auth",
        field: "signupSubtitle",
        content: "Шинэ бүртгэл үүсгэнэ үү",
        type: "text",
        order: 4,
        isActive: true,
      },
      {
        page: "programs",
        section: "auth",
        field: "switchToSignup",
        content: "Бүртгэл байхгүй юу? Бүртгүүлэх",
        type: "text",
        order: 5,
        isActive: true,
      },
      {
        page: "programs",
        section: "auth",
        field: "switchToLogin",
        content: "Бүртгэлтэй юу? Нэвтрэх",
        type: "text",
        order: 6,
        isActive: true,
      },

      // Program modal content
      {
        page: "programs",
        section: "modal",
        field: "descriptionTitle",
        content: "Тайлбар",
        type: "text",
        order: 1,
        isActive: true,
      },
      {
        page: "programs",
        section: "modal",
        field: "featuresTitle",
        content: "Хөтөлбөрийн онцлогууд",
        type: "text",
        order: 2,
        isActive: true,
      },
      {
        page: "programs",
        section: "modal",
        field: "feature1",
        content: "БНХАУ-ын 100% тэтгэлэгийн боломж",
        type: "text",
        order: 3,
        isActive: true,
      },
      {
        page: "programs",
        section: "modal",
        field: "feature2",
        content: "Хэлний мэдлэг шаардахгүй",
        type: "text",
        order: 4,
        isActive: true,
      },
      {
        page: "programs",
        section: "modal",
        field: "feature3",
        content: "Олон улсын стандартын боловсрол",
        type: "text",
        order: 5,
        isActive: true,
      },
      {
        page: "programs",
        section: "modal",
        field: "closeButton",
        content: "Хаах",
        type: "text",
        order: 6,
        isActive: true,
      },
      {
        page: "programs",
        section: "modal",
        field: "applyButton",
        content: "Өргөдөл гаргах",
        type: "text",
        order: 7,
        isActive: true,
      },
    ];

    for (const content of allContent) {
      await prisma.pageContent.create({ data: content });
    }

    console.log("Complete programs page content seeded successfully!");
  } catch (error) {
    console.error("Error seeding complete programs page content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProgramsPageCompleteContent();
