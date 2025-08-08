import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedContent() {
  try {
    console.log("Seeding content...");

    // Clear existing content
    await prisma.pageContent.deleteMany({});

    // Navigation content
    const navigationContent = [
      {
        page: "home",
        section: "navigation",
        field: "logo",
        content: "GrandEdu",
        type: "text",
        order: 1,
      },
      {
        page: "home",
        section: "navigation",
        field: "programsLink",
        content: "Хөтөлбөрүүд",
        type: "text",
        order: 2,
      },
      {
        page: "home",
        section: "navigation",
        field: "loginButton",
        content: "Нэвтрэх",
        type: "text",
        order: 3,
      },
      {
        page: "home",
        section: "navigation",
        field: "logoutButton",
        content: "Гарах",
        type: "text",
        order: 4,
      },
      {
        page: "home",
        section: "navigation",
        field: "welcomeMessage",
        content: "Сайн байна уу, {firstName}!",
        type: "text",
        order: 5,
      },
    ];

    // Hero section content
    const heroContent = [
      {
        page: "home",
        section: "hero",
        field: "title",
        content: "Хятадад зуучлах баталгаат хамт олон GrandEdu",
        type: "text",
        order: 1,
      },
      {
        page: "home",
        section: "hero",
        field: "subtitle",
        content: "Бидэнтэй холбогдоод хятадад амжилттай суралцаарай",
        type: "text",
        order: 2,
      },
      {
        page: "home",
        section: "hero",
        field: "ctaButton",
        content: "Эхлэх",
        type: "text",
        order: 3,
      },
      {
        page: "home",
        section: "hero",
        field: "backgroundImage",
        content:
          "https://images.unsplash.com/photo-1523050854058-8df90110c9e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        type: "image",
        order: 4,
      },
    ];

    // News section content
    const newsContent = [
      {
        page: "home",
        section: "news",
        field: "title",
        content: "Сүүлийн мэдээ",
        type: "text",
        order: 1,
      },
      {
        page: "home",
        section: "news",
        field: "description",
        content:
          "Хятадын их сургуулиудад элсэх боломж болон тэтгэлгийн мэдээллийг аваарай",
        type: "text",
        order: 2,
      },
      {
        page: "home",
        section: "news",
        field: "viewAllButton",
        content: "Бүх мэдээг харах →",
        type: "text",
        order: 3,
      },
      {
        page: "home",
        section: "news",
        field: "newsCardTag",
        content: "ХӨТӨЛБӨР",
        type: "text",
        order: 4,
      },
      {
        page: "home",
        section: "news",
        field: "newsCardDate",
        content: "2025 оны 6-р сар",
        type: "text",
        order: 5,
      },
      {
        page: "home",
        section: "news",
        field: "newsCardTitle",
        content:
          "6+6 Хятад хэлний бэлтгэл хөтөлбөр (2025 оны 6-р сарын элсэлт)",
        type: "text",
        order: 6,
      },
      {
        page: "home",
        section: "news",
        field: "newsCardDescription",
        content: "Монголд 6 сар, Хятадт 6-11 сар хэлний бэлтгэл",
        type: "text",
        order: 7,
      },
    ];

    // Programs section content
    const programsContent = [
      {
        page: "home",
        section: "programs",
        field: "title",
        content: "Манай хөтөлбөрүүд",
        type: "text",
        order: 1,
      },
      {
        page: "home",
        section: "programs",
        field: "description",
        content: "Хятадын их сургуулиудад суралцах боломжийг сонгоно уу",
        type: "text",
        order: 2,
      },
      {
        page: "home",
        section: "programs",
        field: "program1Title",
        content: "Хятад хэлний бэлтгэл",
        type: "text",
        order: 3,
      },
      {
        page: "home",
        section: "programs",
        field: "program1Description",
        content: "Хятад хэлний суурь мэдлэг",
        type: "text",
        order: 4,
      },
      {
        page: "home",
        section: "programs",
        field: "program2Title",
        content: "Бакалаврын хөтөлбөр",
        type: "text",
        order: 5,
      },
      {
        page: "home",
        section: "programs",
        field: "program2Description",
        content: "4 жилийн дээд боловсрол",
        type: "text",
        order: 6,
      },
      {
        page: "home",
        section: "programs",
        field: "program3Title",
        content: "Магистрын хөтөлбөр",
        type: "text",
        order: 7,
      },
      {
        page: "home",
        section: "programs",
        field: "program3Description",
        content: "2 жилийн магистрын зэрэг",
        type: "text",
        order: 8,
      },
      {
        page: "home",
        section: "programs",
        field: "program4Title",
        content: "Докторын хөтөлбөр",
        type: "text",
        order: 9,
      },
      {
        page: "home",
        section: "programs",
        field: "program4Description",
        content: "3-4 жилийн докторын зэрэг",
        type: "text",
        order: 10,
      },
      {
        page: "home",
        section: "programs",
        field: "viewMoreButton",
        content: "Дэлгэрэнгүй →",
        type: "text",
        order: 11,
      },
    ];

    // Universities section content
    const universitiesContent = [
      {
        page: "home",
        section: "universities",
        field: "title",
        content: "Хамтран ажилладаг их сургуулиуд",
        type: "text",
        order: 1,
      },
      {
        page: "home",
        section: "universities",
        field: "description",
        content: "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг",
        type: "text",
        order: 2,
      },
      {
        page: "home",
        section: "universities",
        field: "university1Name",
        content: "Сычуань их сургууль",
        type: "text",
        order: 3,
      },
      {
        page: "home",
        section: "universities",
        field: "university1Location",
        content: "Чэнду, Сычуань",
        type: "text",
        order: 4,
      },
      {
        page: "home",
        section: "universities",
        field: "university2Name",
        content: "Хятадын Шинжлэх Ухаан, Технологийн Их Сургууль",
        type: "text",
        order: 5,
      },
      {
        page: "home",
        section: "universities",
        field: "university2Location",
        content: "Хэфэй, Аньхой",
        type: "text",
        order: 6,
      },
      {
        page: "home",
        section: "universities",
        field: "university3Name",
        content: "Шанхайн Жяо Тонгийн Их Сургууль",
        type: "text",
        order: 7,
      },
      {
        page: "home",
        section: "universities",
        field: "university3Location",
        content: "Шанхай",
        type: "text",
        order: 8,
      },
      {
        page: "home",
        section: "universities",
        field: "viewMoreButton",
        content: "Дэлгэрэнгүй →",
        type: "text",
        order: 9,
      },
    ];

    // Combine all content
    // Programs page content
    const programsPageContent = [
      {
        page: "programs",
        section: "header",
        field: "title",
        content: "Хөтөлбөрүүд",
        type: "text",
        order: 1,
      },
      {
        page: "programs",
        section: "header",
        field: "description",
        content: "Хятадын их сургуулиудад суралцах боломжийг сонгоно уу",
        type: "text",
        order: 2,
      },
      {
        page: "programs",
        section: "programs",
        field: "requirementsLabel",
        content: "Шаардлага:",
        type: "text",
        order: 1,
      },
      {
        page: "programs",
        section: "programs",
        field: "applyButton",
        content: "Хүсэлт илгээх",
        type: "text",
        order: 2,
      },
      {
        page: "programs",
        section: "empty",
        field: "message",
        content: "Одоогоор хөтөлбөр байхгүй байна",
        type: "text",
        order: 1,
      },
    ];

    const allContent = [
      ...navigationContent,
      ...heroContent,
      ...newsContent,
      ...programsContent,
      ...universitiesContent,
      ...programsPageContent,
    ];

    // Insert all content
    for (const content of allContent) {
      await prisma.pageContent.create({
        data: content,
      });
    }

    console.log("Content seeded successfully!");
  } catch (error) {
    console.error("Error seeding content:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedContent();
