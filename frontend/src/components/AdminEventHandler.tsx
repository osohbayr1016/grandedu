"use client";

"use client";

import { authenticatedFetch, getApiBaseUrl } from "@/utils/api";

interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  adminNote?: string;
}

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price?: string;
  location?: string;
  university?: string;
  requirements?: string;
  imageUrl?: string;
  googleFormLink?: string;
  isHighlighted: boolean;
  isActive: boolean;
  adminNote?: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  isActive: boolean;
}

interface UniversityForm {
  name: string;
  location: string;
  description: string;
  imageUrl?: string;
  adminNote: string;
}

interface ProgramForm {
  title: string;
  description: string;
  duration: string;
  level: string;
  price?: string;
  location?: string;
  university?: string;
  requirements?: string;
  imageUrl?: string;
  googleFormLink?: string;
  adminNote: string;
}

interface NewsForm {
  title: string;
  content: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
}

interface FooterContent {
  companyDescription: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  privacyPolicy: string;
  termsOfService: string;
  copyright: string;
}

export default function AdminEventHandler() {
  const handleFooterSave = async (
    changes: Partial<FooterContent> | undefined,
    currentFooter: FooterContent,
    setHasChanges: (value: boolean) => void
  ) => {
    const payload: Partial<FooterContent> = changes ?? currentFooter;

    await authenticatedFetch(`${getApiBaseUrl()}/api/content/footer`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setHasChanges(false);
  };

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
    handleFooterSave,
    handleUniversityEdit,
    handleUniversityAdd,
    handleProgramEdit,
    handleProgramAdd,
    handleNewsEdit,
    handleNewsAdd,
  };
}
