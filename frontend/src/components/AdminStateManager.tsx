"use client";

import { useState } from "react";

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

interface AdminStateManagerProps {
  children: (state: {
    // Modal states
    showUniversityModal: boolean;
    setShowUniversityModal: (show: boolean) => void;
    editingUniversity: University | null;
    setEditingUniversity: (university: University | null) => void;
    showProgramModal: boolean;
    setShowProgramModal: (show: boolean) => void;
    editingProgram: Program | null;
    setEditingProgram: (program: Program | null) => void;
    showNewsModal: boolean;
    setShowNewsModal: (show: boolean) => void;
    editingNews: News | null;
    setEditingNews: (news: News | null) => void;
    showUserModal: boolean;
    setShowUserModal: (show: boolean) => void;

    // Form states
    universityForm: {
      name: string;
      location: string;
      description: string;
      imageUrl: string;
      adminNote: string;
    };
    setUniversityForm: (form: {
      name: string;
      location: string;
      description: string;
      imageUrl: string;
      adminNote: string;
    }) => void;
    programForm: {
      title: string;
      description: string;
      duration: string;
      level: string;
      imageUrl: string;
      googleFormLink: string;
      adminNote: string;
    };
    setProgramForm: (form: {
      title: string;
      description: string;
      duration: string;
      level: string;
      imageUrl: string;
      googleFormLink: string;
      adminNote: string;
    }) => void;
    newsForm: {
      title: string;
      content: string;
      author: string;
      publishDate: string;
      imageUrl: string;
    };
    setNewsForm: (form: {
      title: string;
      content: string;
      author: string;
      publishDate: string;
      imageUrl: string;
    }) => void;
    newAdminForm: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phoneNumber: string;
    };
    setNewAdminForm: (form: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phoneNumber: string;
    }) => void;

    // Filter and sort states
    userFilter: "all" | "starred" | "admin" | "user";
    setUserFilter: (filter: "all" | "starred" | "admin" | "user") => void;
    userSortBy: "name" | "id" | "date";
    setUserSortBy: (sort: "name" | "id" | "date") => void;

    // Other states
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    activeSection: string;
    setActiveSection: (section: string) => void;
    saving: boolean;
    setSaving: (saving: boolean) => void;
    footerSaving: boolean;
    setFooterSaving: (saving: boolean) => void;
    footerHasChanges: boolean;
    setFooterHasChanges: (hasChanges: boolean) => void;
    universitySectionSaving: boolean;
    setUniversitySectionSaving: (saving: boolean) => void;
    universitySectionHasChanges: boolean;
    setUniversitySectionHasChanges: (hasChanges: boolean) => void;
    selectedUniversityForContent: string;
    setSelectedUniversityForContent: (universityId: string) => void;
  }) => React.ReactNode;
}

export default function AdminStateManager({
  children,
}: AdminStateManagerProps) {
  // Modal states
  const [showUniversityModal, setShowUniversityModal] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(
    null
  );
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Form states
  const [universityForm, setUniversityForm] = useState({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
    adminNote: "",
  });
  const [programForm, setProgramForm] = useState({
    title: "",
    description: "",
    duration: "",
    level: "",
    imageUrl: "",
    googleFormLink: "",
    adminNote: "",
  });
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    author: "",
    publishDate: "",
    imageUrl: "",
  });
  const [newAdminForm, setNewAdminForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  // Filter and sort states
  const [userFilter, setUserFilter] = useState<
    "all" | "starred" | "admin" | "user"
  >("all");
  const [userSortBy, setUserSortBy] = useState<"name" | "id" | "date">("date");

  // Other states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [footerSaving, setFooterSaving] = useState(false);
  const [footerHasChanges, setFooterHasChanges] = useState(false);
  const [universitySectionSaving, setUniversitySectionSaving] = useState(false);
  const [universitySectionHasChanges, setUniversitySectionHasChanges] =
    useState(false);
  const [selectedUniversityForContent, setSelectedUniversityForContent] =
    useState<string>("");

  return children({
    showUniversityModal,
    setShowUniversityModal,
    editingUniversity,
    setEditingUniversity,
    showProgramModal,
    setShowProgramModal,
    editingProgram,
    setEditingProgram,
    showNewsModal,
    setShowNewsModal,
    editingNews,
    setEditingNews,
    showUserModal,
    setShowUserModal,
    universityForm,
    setUniversityForm,
    programForm,
    setProgramForm,
    newsForm,
    setNewsForm,
    newAdminForm,
    setNewAdminForm,
    userFilter,
    setUserFilter,
    userSortBy,
    setUserSortBy,
    searchQuery,
    setSearchQuery,
    activeSection,
    setActiveSection,
    saving,
    setSaving,
    footerSaving,
    setFooterSaving,
    footerHasChanges,
    setFooterHasChanges,
    universitySectionSaving,
    setUniversitySectionSaving,
    universitySectionHasChanges,
    setUniversitySectionHasChanges,
    selectedUniversityForContent,
    setSelectedUniversityForContent,
  });
}
