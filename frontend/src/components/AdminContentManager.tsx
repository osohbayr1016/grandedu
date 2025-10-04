"use client";

import { University, Program, News, User, GroupedContent } from "@/types";
import ContentEditor from "./ContentEditor";
import UserManagement from "./UserManagement";
import FooterEditor from "./FooterEditor";
import UniversityContentEditor from "./UniversityContentEditor";
import AdminUniversitiesTable from "./AdminUniversitiesTable";
import AdminProgramsTable from "./AdminProgramsTable";
import AdminNewsTable from "./AdminNewsTable";

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
  onSaveFooter: (changes?: Partial<FooterContent>) => Promise<void>;
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
  const contentEditorSections = ["hero", "about", "contact"];

  if (contentEditorSections.includes(activeSection)) {
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
      <AdminUniversitiesTable
        universities={universities}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onEdit={onUniversityEdit}
        onToggleStatus={onUniversityToggle}
        onAdd={onUniversityAdd}
      />
    );
  }

  if (activeSection === "programs") {
    return (
      <AdminProgramsTable
        programs={programs}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onEdit={onProgramEdit}
        onToggleStatus={onProgramToggle}
        onAdd={onProgramAdd}
      />
    );
  }

  if (activeSection === "news") {
    return (
      <AdminNewsTable
        news={news}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onEdit={onNewsEdit}
        onToggleStatus={onNewsToggle}
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
