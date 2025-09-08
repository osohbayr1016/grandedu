"use client";

interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  adminNote?: string;
}

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  imageUrl: string;
  googleFormLink: string;
  isActive: boolean;
  isHighlighted?: boolean;
  adminNote?: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  imageUrl: string;
  isActive: boolean;
}

interface UniversityForm {
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  adminNote: string;
}

interface ProgramForm {
  title: string;
  description: string;
  duration: string;
  level: string;
  imageUrl: string;
  googleFormLink: string;
  adminNote: string;
}

interface NewsForm {
  title: string;
  content: string;
  author: string;
  publishDate: string;
  imageUrl: string;
}

export default function AdminEventHandler() {
  const handleUniversityEdit = (
    university: University,
    setEditingUniversity: (university: University | null) => void,
    setUniversityForm: (form: UniversityForm) => void,
    setShowUniversityModal: (show: boolean) => void
  ) => {
    setEditingUniversity(university);
    setUniversityForm({
      name: university.name,
      location: university.location,
      description: university.description,
      imageUrl: university.imageUrl,
      adminNote: university.adminNote || "",
    });
    setShowUniversityModal(true);
  };

  const handleUniversityAdd = (
    setEditingUniversity: (university: University | null) => void,
    setUniversityForm: (form: UniversityForm) => void,
    setShowUniversityModal: (show: boolean) => void
  ) => {
    setEditingUniversity(null);
    setUniversityForm({
      name: "",
      location: "",
      description: "",
      imageUrl: "",
      adminNote: "",
    });
    setShowUniversityModal(true);
  };

  const handleProgramEdit = (
    program: Program,
    setEditingProgram: (program: Program | null) => void,
    setProgramForm: (form: ProgramForm) => void,
    setShowProgramModal: (show: boolean) => void
  ) => {
    setEditingProgram(program);
    setProgramForm({
      title: program.title,
      description: program.description,
      duration: program.duration,
      level: program.level,
      imageUrl: program.imageUrl,
      googleFormLink: program.googleFormLink,
      adminNote: program.adminNote || "",
    });
    setShowProgramModal(true);
  };

  const handleProgramAdd = (
    setEditingProgram: (program: Program | null) => void,
    setProgramForm: (form: ProgramForm) => void,
    setShowProgramModal: (show: boolean) => void
  ) => {
    setEditingProgram(null);
    setProgramForm({
      title: "",
      description: "",
      duration: "",
      level: "",
      imageUrl: "",
      googleFormLink: "",
      adminNote: "",
    });
    setShowProgramModal(true);
  };

  const handleNewsEdit = (
    newsItem: News,
    setEditingNews: (news: News | null) => void,
    setNewsForm: (form: NewsForm) => void,
    setShowNewsModal: (show: boolean) => void
  ) => {
    setEditingNews(newsItem);
    setNewsForm({
      title: newsItem.title,
      content: newsItem.content,
      author: newsItem.author,
      publishDate: newsItem.publishDate,
      imageUrl: newsItem.imageUrl,
    });
    setShowNewsModal(true);
  };

  const handleNewsAdd = (
    setEditingNews: (news: News | null) => void,
    setNewsForm: (form: NewsForm) => void,
    setShowNewsModal: (show: boolean) => void
  ) => {
    setEditingNews(null);
    const today = new Date().toISOString().split("T")[0];
    setNewsForm({
      title: "",
      content: "",
      author: "",
      publishDate: today,
      imageUrl: "",
    });
    setShowNewsModal(true);
  };

  return {
    handleUniversityEdit,
    handleUniversityAdd,
    handleProgramEdit,
    handleProgramAdd,
    handleNewsEdit,
    handleNewsAdd,
  };
}
