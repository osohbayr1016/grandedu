"use client";

import ContentEditor from "./ContentEditor";
import DataTable from "./DataTable";
import UserManagement from "./UserManagement";
import FooterEditor from "./FooterEditor";
import UniversityContentEditor from "./UniversityContentEditor";

interface GroupedContent {
  [section: string]: {
    [field: string]: string;
  };
}

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

interface User {
  id: string;
  userCode: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isHighlighted: boolean;
  createdAt: string;
  updatedAt: string;
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

interface UniversitySectionContent {
  programsTitle: string;
  programsDescription: string;
  programsAdminNote: string;
  admissionRequirementsTitle: string;
  admissionRequirementsDescription: string;
  cityLifeTitle: string;
  cityLifeDescription: string;
}

interface AdminContentManagerProps {
  activeSection: string;
  groupedContent: GroupedContent;
  onSectionChange: (section: string) => void;
  onContentChange: (
    section: string,
    field: string,
    value: string
  ) => Promise<void>;
  onSaveContent: () => Promise<void>;
  saving: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  universities: University[];
  programs: Program[];
  news: News[];
  users: User[];
  footerContent: FooterContent;
  universitySectionContent: UniversitySectionContent;
  onUniversityEdit: (university: University) => void;
  onUniversityToggle: (university: University) => Promise<void>;
  onUniversityAdd: () => void;
  onProgramEdit: (program: Program) => void;
  onProgramToggle: (program: Program) => Promise<void>;
  onProgramAdd: () => void;
  onNewsEdit: (news: News) => void;
  onNewsToggle: (news: News) => Promise<void>;
  onNewsAdd: () => void;
  onUserToggleHighlight: (user: User) => Promise<void>;
  onUserDelete: (user: User) => Promise<void>;
  showUserModal: boolean;
  onCloseUserModal: () => void;
  onSaveNewAdmin: (adminData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => Promise<void>;
  newAdminForm: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  };
  onNewAdminFormChange: (field: string, value: string) => void;
  userFilter: "all" | "starred" | "admin" | "user";
  onFilterChange: (filter: "all" | "starred" | "admin" | "user") => void;
  userSortBy: "name" | "id" | "date";
  onSortChange: (sort: "name" | "id" | "date") => void;
  onFooterContentChange: (field: string, value: string) => void;
  onSaveFooter: () => Promise<void>;
  footerSaving: boolean;
  footerHasChanges: boolean;
  onUniversitySectionContentChange: (field: string, value: string) => void;
  onSaveUniversitySection: () => Promise<void>;
  universitySectionSaving: boolean;
  universitySectionHasChanges: boolean;
  selectedUniversityForContent: string;
  onUniversityForContentChange: (universityId: string) => void;
}

export default function AdminContentManager({
  activeSection,
  groupedContent,
  onSectionChange,
  onContentChange,
  onSaveContent,
  saving,
  searchQuery,
  onSearchChange,
  universities,
  programs,
  news,
  users,
  footerContent,
  universitySectionContent,
  onUniversityEdit,
  onUniversityToggle,
  onUniversityAdd,
  onProgramEdit,
  onProgramToggle,
  onProgramAdd,
  onNewsEdit,
  onNewsToggle,
  onNewsAdd,
  onUserToggleHighlight,
  onUserDelete,
  showUserModal,
  onCloseUserModal,
  onSaveNewAdmin,
  newAdminForm,
  onNewAdminFormChange,
  userFilter,
  onFilterChange,
  userSortBy,
  onSortChange,
  onFooterContentChange,
  onSaveFooter,
  footerSaving,
  footerHasChanges,
  onUniversitySectionContentChange,
  onSaveUniversitySection,
  universitySectionSaving,
  universitySectionHasChanges,
  selectedUniversityForContent,
  onUniversityForContentChange,
}: AdminContentManagerProps) {
  // Content sections that use ContentEditor
  const contentSections = [
    "hero",
    "about",
    "programs",
    "universities",
    "news",
    "contact",
  ];

  if (contentSections.includes(activeSection)) {
    return (
      <ContentEditor
        groupedContent={groupedContent}
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        onContentChange={onContentChange}
        onSave={onSaveContent}
        saving={saving}
      />
    );
  }

  if (activeSection === "universities") {
    return (
      <DataTable
        title="Их сургуулиуд"
        data={universities}
        columns={[
          { key: "name", label: "Нэр" },
          { key: "location", label: "Байршил" },
          {
            key: "isActive",
            label: "Статус",
            render: (value) => (value ? "Идэвхтэй" : "Идэвхгүй"),
          },
        ]}
        onEdit={onUniversityEdit}
        onToggleStatus={onUniversityToggle}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onAdd={onUniversityAdd}
      />
    );
  }

  if (activeSection === "programs") {
    return (
      <DataTable
        title="Хөтөлбөрүүд"
        data={programs}
        columns={[
          { key: "title", label: "Гарчиг" },
          { key: "level", label: "Түвшин" },
          { key: "duration", label: "Хугацаа" },
          {
            key: "isActive",
            label: "Статус",
            render: (value) => (value ? "Идэвхтэй" : "Идэвхгүй"),
          },
        ]}
        onEdit={onProgramEdit}
        onToggleStatus={onProgramToggle}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onAdd={onProgramAdd}
      />
    );
  }

  if (activeSection === "news") {
    return (
      <DataTable
        title="Мэдээ"
        data={news}
        columns={[
          { key: "title", label: "Гарчиг" },
          { key: "author", label: "Зохиогч" },
          {
            key: "publishDate",
            label: "Огноо",
            render: (value) =>
              new Date(String(value)).toLocaleDateString("mn-MN"),
          },
          {
            key: "isActive",
            label: "Статус",
            render: (value) => (value ? "Идэвхтэй" : "Идэвхгүй"),
          },
        ]}
        onEdit={onNewsEdit}
        onToggleStatus={onNewsToggle}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onAdd={onNewsAdd}
      />
    );
  }

  if (activeSection === "users") {
    return (
      <UserManagement
        users={users}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        userFilter={userFilter}
        onFilterChange={onFilterChange}
        userSortBy={userSortBy}
        onSortChange={onSortChange}
        onToggleHighlight={onUserToggleHighlight}
        onDeleteUser={onUserDelete}
        showUserModal={showUserModal}
        onCloseUserModal={onCloseUserModal}
        onSaveNewAdmin={onSaveNewAdmin}
        newAdminForm={newAdminForm}
        onNewAdminFormChange={onNewAdminFormChange}
        saving={saving}
      />
    );
  }

  if (activeSection === "footer") {
    return (
      <FooterEditor
        footerContent={footerContent}
        onContentChange={onFooterContentChange}
        onSave={onSaveFooter}
        saving={footerSaving}
        hasChanges={footerHasChanges}
      />
    );
  }

  if (activeSection === "university-sections") {
    return (
      <UniversityContentEditor
        content={universitySectionContent}
        onContentChange={onUniversitySectionContentChange}
        onSave={onSaveUniversitySection}
        saving={universitySectionSaving}
        hasChanges={universitySectionHasChanges}
        selectedUniversity={selectedUniversityForContent}
        onUniversityChange={onUniversityForContentChange}
        universities={universities.map((u) => ({ id: u.id, name: u.name }))}
      />
    );
  }

  return null;
}
