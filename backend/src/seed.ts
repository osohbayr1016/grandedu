import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing programs
  await prisma.program.deleteMany();

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@grandedu.com" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@grandedu.com",
      password: await bcrypt.hash("admin123", 10),
      phoneNumber: "+976 9999 9999",
      role: "admin",
    },
  });

  console.log("Admin user created:", adminUser.email);

  // Create sample programs
  const programs = [
    {
      title: "6+6 Хятад хэлний бэлтгэл хөтөлбөр",
      description:
        "Монголд 6 сар хэлний бэлтгэл, дараа нь Хятадт 6-11 сар хэлний сургалт. Энэ хөтөлбөр нь оюутнуудад хятад хэлний суурь мэдлэгийг өгч, Хятадт суралцахад бэлтгэхэд тустай.",
      duration: "6+6 сар",
      price: "2,500,000₮",
      location: "Улаанбаатар, Чэнду",
      university: "Сычуаний Соёлын Аж Үйлдвэрийн Мэргэжлийн Коллеж",
      requirements: "12-р ангийн төгсөлт, хятад хэлний суурь мэдлэгтэй байх",
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=300&fit=crop",
    },
    {
      title: "1+4 Бакалаврын хөтөлбөр",
      description:
        "Хагас жилийн хэлний бэлтгэл + 4 жилийн бакалаврын зэрэг. Энэ хөтөлбөр нь оюутнуудад хятад хэлний мэдлэгийг сайжруулж, их сургуулийн сургалтад бэлтгэхэд тустай.",
      duration: "1+4 жил",
      price: "8,000,000₮",
      location: "Улаанбаатар, Хэфэй",
      university: "Хятадын Шинжлэх Ухаан, Технологийн Их Сургууль",
      requirements: "12-р ангийн төгсөлт, математик, физикийн сайн мэдлэг",
      imageUrl:
        "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop",
    },
    {
      title: "Магистрын хөтөлбөр",
      description:
        "Хятадын их сургуулиудад магистрын зэрэгт элсэх хөтөлбөр. Энэ хөтөлбөр нь бакалаврын зэрэгтэй оюутнуудад зориулсан бөгөөд тэдний мэргэжлийн мэдлэгийг гүнзгийрүүлэхэд тустай.",
      duration: "2-3 жил",
      price: "12,000,000₮",
      location: "Шанхай",
      university: "Шанхайн Жяо Тонгийн Их Сургууль",
      requirements: "Бакалаврын зэрэг, IELTS 6.0 эсвэл HSK 5-р түвшин",
      imageUrl:
        "https://images.unsplash.com/photo-1523240794102-9ebd0dea756e?w=400&h=300&fit=crop",
    },
    {
      title: "Докторын хөтөлбөр",
      description:
        "Хятадын их сургуулиудад докторын зэрэгт элсэх хөтөлбөр. Энэ хөтөлбөр нь магистрын зэрэгтэй оюутнуудад зориулсан бөгөөд тэдний судалгааны чадварыг хөгжүүлэхэд тустай.",
      duration: "3-4 жил",
      price: "15,000,000₮",
      location: "Бээжинг",
      university: "Бээжингийн Их Сургууль",
      requirements:
        "Магистрын зэрэг, судалгааны төсөл, IELTS 6.5 эсвэл HSK 6-р түвшин",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    },
    {
      title: "Хэлний бэлтгэл хөтөлбөр",
      description:
        "Хятад хэлний сургалтын тусгай хөтөлбөр. Энэ хөтөлбөр нь хятад хэл суралцахыг хүсэгч бүх хүмүүст зориулсан бөгөөд тэдний хэлний мэдлэгийг сайжруулахад тустай.",
      duration: "6-12 сар",
      price: "3,000,000₮",
      location: "Улаанбаатар",
      university: "GrandEdu Хэлний Сургалтын Төв",
      requirements: "Хятад хэл суралцах хүсэлтэй байх",
      imageUrl:
        "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop",
    },
    {
      title: "Тэтгэлгийн хөтөлбөр",
      description:
        "Хятадын засгийн газрын тэтгэлгээр суралцах боломж. Энэ хөтөлбөр нь сайн сургалттай оюутнуудад зориулсан бөгөөд тэдний сургалтын зардлыг бүрэн хамрагдана.",
      duration: "4-5 жил",
      price: "Тэтгэлэг",
      location: "Хятадын төрөл бүрийн хот",
      university: "Хятадын засгийн газрын тэтгэлгийн хөтөлбөр",
      requirements:
        "12-р ангийн төгсөлт, сайн дүн, IELTS 6.0 эсвэл HSK 4-р түвшин",
      imageUrl:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=400&h=300&fit=crop",
    },
  ];

  for (const program of programs) {
    await prisma.program.create({
      data: program,
    });
  }

  console.log("Sample programs created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
