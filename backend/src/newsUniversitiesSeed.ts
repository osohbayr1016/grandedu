import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.news.deleteMany();
  await prisma.university.deleteMany();

  // Create sample universities
  const universities = [
    {
      name: "Сычуань их сургууль",
      location: "Чэнду, Сычуань",
      description:
        "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг, инженерчлэл, шинжлэх ухаан, технологийн чиглэлээр алдартай.",
      imageUrl:
        "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop",
    },
    {
      name: "Хятадын Шинжлэх Ухаан, Технологийн Их Сургууль",
      location: "Хэфэй, Аньхой",
      description:
        "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг, физик, математик, компьютерийн шинжлэх ухааны салбарт алдартай.",
      imageUrl:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop",
    },
    {
      name: "Шанхайн Жяо Тонгийн Их Сургууль",
      location: "Шанхай",
      description:
        "Хятадын тэргүүлэгч их сургуулиудтай хамтран ажилладаг, бизнес, инженерчлэл, анагаах ухааны салбарт алдартай.",
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=300&fit=crop",
    },
    {
      name: "Пекингийн Их Сургууль",
      location: "Пекин",
      description:
        "Хятадын хамгийн эртний их сургуулиудын нэг, нийгмийн шинжлэх ухаан, гуманитар ухааны салбарт тэргүүлдэг.",
      imageUrl:
        "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=300&fit=crop",
    },
    {
      name: "Цинхуагийн Их Сургууль",
      location: "Пекин",
      description:
        "Хятадын топ их сургуулиудын нэг, инженерчлэл, шинжлэх ухаан, технологийн салбарт дэлхийд алдартай.",
      imageUrl:
        "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&h=300&fit=crop",
    },
  ];

  for (const university of universities) {
    await prisma.university.create({
      data: university,
    });
  }

  // Create sample news
  const news = [
    {
      title: "2025 оны элсэлтийн хөтөлбөр эхэллээ",
      content:
        "Монголын оюутнуудад зориулсан Хятадын их сургуулиудын 2025 оны элсэлтийн хөтөлбөр албан ёсоор эхэллээ. Энэ жил 50-аас дээш их сургуулиас тэтгэлэгтэй суралцах боломж байна.",
      author: "GrandEdu Admin",
      publishDate: new Date("2024-12-15"),
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=300&fit=crop",
    },
    {
      title: "Хятад хэлний бэлтгэл курс шинэчлэгдлээ",
      content:
        "Манай байгууллага Хятад хэлний бэлтгэл курсыг шинэчилж, HSK-ийн шинэ хөтөлбөрт нийцүүлэн боловсруулав. Курст орох бүртгэл энэ сарын 20-ноос эхэлнэ.",
      author: "GrandEdu Admin",
      publishDate: new Date("2024-12-10"),
      imageUrl:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    },
    {
      title: "Шинэ их сургуулиудтай түншлэл байгууллаа",
      content:
        "GrandEdu Хятадын 10 шинэ их сургуулиудтай түншлэлийн гэрээ байгууллаа. Үүний дотор инженерчлэл, эдийн засаг, анагаах ухааны чиглэлээр төгсөгчдөд илүү олон боломж нээгдэнэ.",
      author: "GrandEdu Admin",
      publishDate: new Date("2024-12-05"),
      imageUrl:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
    },
    {
      title: "Амжилттай төгссөн оюутнуудын түүх",
      content:
        "Манай төгсөгчид Хятадын их сургуулиудаас амжилттай төгсөж, олон улсын компаниудад ажиллаж байна. Тэдний амжилтын түүхийг энэ мэдээгээр хуваалцаж байна.",
      author: "GrandEdu Admin",
      publishDate: new Date("2024-11-28"),
      imageUrl:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
    },
    {
      title: "Тэтгэлгийн шинэ боломжууд",
      content:
        "Хятадын засгийн газрын тэтгэлэг болон их сургуулиудын тэтгэлгийн шинэ мэдээллийг танилцуулж байна. 2025 онд тэтгэлгийн хэмжээ нэмэгдэж, илүү олон салбарт боломж нээгдэнэ.",
      author: "GrandEdu Admin",
      publishDate: new Date("2024-11-20"),
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    },
  ];

  for (const newsItem of news) {
    await prisma.news.create({
      data: newsItem,
    });
  }

  console.log("Universities and news seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
