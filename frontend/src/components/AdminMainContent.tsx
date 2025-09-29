"use client";

import { useFooter } from "@/contexts/FooterContext";
import { useUniversity } from "@/contexts/UniversityContext";
import AdminHeader from "./AdminHeader";
import DashboardStats from "./DashboardStats";
import AdminContentManager from "./AdminContentManager";
import AdminModals from "./AdminModals";
import AdminStateManager from "./AdminStateManager";
import AdminEventHandler from "./AdminEventHandler";

interface GroupedContent {
  [section: string]: {
    [field: string]: string;
  };
}

interface DashboardStats {
  totalUsers: number;
  totalPrograms: number;
  totalNews: number;
  totalUniversities: number;
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

interface AdminMainContentProps {
  activeSection: string;
  sections: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
  onActiveSectionChange: (section: string) => void;
  groupedContent: GroupedContent;
  stats: DashboardStats;
  universities: University[];
  programs: Program[];
  news: News[];
  users: User[];
  onContentChange: (
    section: string,
    field: string,
    value: string
  ) => Promise<void>;
  onSaveContent: () => Promise<void>;
}

export default function AdminMainContent({
  activeSection,
  sections,
  onActiveSectionChange,
  groupedContent,
  stats,
  universities,
  programs,
  news,
  users,
  onContentChange,
  onSaveContent,
}: AdminMainContentProps) {
  const { footerContent, updateFooterContent } = useFooter();
  const { universitySectionContent, updateUniversitySectionContent } =
    useUniversity();

  return (
    <div className="flex-1 p-6">
      <AdminHeader activeSection={activeSection} sections={sections} />

      <DashboardStats stats={stats} />

      <AdminStateManager
        initialActiveSection={activeSection}
        onActiveSectionChange={onActiveSectionChange}
      >
        {(state) => {
          const eventHandlers = AdminEventHandler();

          return (
            <>
              <AdminContentManager
                activeSection={state.activeSection}
                groupedContent={groupedContent}
                onSectionChange={state.setActiveSection}
                onContentChange={onContentChange}
                onSaveContent={onSaveContent}
                saving={state.saving}
                searchQuery={state.searchQuery}
                onSearchChange={state.setSearchQuery}
                universities={universities}
                programs={programs}
                news={news}
                users={users}
                footerContent={footerContent}
                universitySectionContent={universitySectionContent}
                onUniversityEdit={(university) =>
                  eventHandlers.handleUniversityEdit(
                    university,
                    state.setEditingUniversity,
                    state.setUniversityForm,
                    state.setShowUniversityModal
                  )
                }
                onUniversityToggle={async () => {}}
                onUniversityAdd={() =>
                  eventHandlers.handleUniversityAdd(
                    state.setEditingUniversity,
                    state.setUniversityForm,
                    state.setShowUniversityModal
                  )
                }
                onProgramEdit={(program) =>
                  eventHandlers.handleProgramEdit(
                    program,
                    state.setEditingProgram,
                    state.setProgramForm,
                    state.setShowProgramModal
                  )
                }
                onProgramToggle={async () => {}}
                onProgramAdd={() =>
                  eventHandlers.handleProgramAdd(
                    state.setEditingProgram,
                    state.setProgramForm,
                    state.setShowProgramModal
                  )
                }
                onNewsEdit={(news) =>
                  eventHandlers.handleNewsEdit(
                    news,
                    state.setEditingNews,
                    state.setNewsForm,
                    state.setShowNewsModal
                  )
                }
                onNewsToggle={async () => {}}
                onNewsAdd={() =>
                  eventHandlers.handleNewsAdd(
                    state.setEditingNews,
                    state.setNewsForm,
                    state.setShowNewsModal
                  )
                }
                onUserToggleHighlight={async () => {}}
                onUserDelete={async () => {}}
                showUserModal={state.showUserModal}
                onCloseUserModal={() => state.setShowUserModal(false)}
                onSaveNewAdmin={async () => {}}
                newAdminForm={state.newAdminForm}
                onNewAdminFormChange={(field, value) => {
                  state.setNewAdminForm({
                    ...state.newAdminForm,
                    [field]: value,
                  });
                }}
                userFilter={state.userFilter}
                onFilterChange={state.setUserFilter}
                userSortBy={state.userSortBy}
                onSortChange={state.setUserSortBy}
                onFooterContentChange={(field, value) => {
                  updateFooterContent({ [field]: value } as Partial<
                    typeof footerContent
                  >);
                }}
                onSaveFooter={async () => {
                  state.setFooterSaving(true);
                  try {
                    // Save footer logic
                  } finally {
                    state.setFooterSaving(false);
                  }
                }}
                footerSaving={state.footerSaving}
                footerHasChanges={state.footerHasChanges}
                onUniversitySectionContentChange={(field, value) => {
                  updateUniversitySectionContent({ [field]: value } as Partial<
                    typeof universitySectionContent
                  >);
                }}
                onSaveUniversitySection={async () => {
                  state.setUniversitySectionSaving(true);
                  try {
                    // Save university section logic
                  } finally {
                    state.setUniversitySectionSaving(false);
                  }
                }}
                universitySectionSaving={state.universitySectionSaving}
                universitySectionHasChanges={state.universitySectionHasChanges}
                selectedUniversityForContent={
                  state.selectedUniversityForContent
                }
                onUniversityForContentChange={
                  state.setSelectedUniversityForContent
                }
              />

              <AdminModals
                showUniversityModal={state.showUniversityModal}
                onCloseUniversityModal={() =>
                  state.setShowUniversityModal(false)
                }
                onSaveUniversity={async () => {
                  state.setSaving(true);
                  try {
                    // Save university logic
                  } finally {
                    state.setSaving(false);
                    state.setShowUniversityModal(false);
                  }
                }}
                editingUniversity={state.editingUniversity}
                universitySaving={state.saving}
                showProgramModal={state.showProgramModal}
                onCloseProgramModal={() => state.setShowProgramModal(false)}
                onSaveProgram={async () => {
                  state.setSaving(true);
                  try {
                    // Save program logic
                  } finally {
                    state.setSaving(false);
                    state.setShowProgramModal(false);
                  }
                }}
                editingProgram={state.editingProgram}
                programSaving={state.saving}
                showNewsModal={state.showNewsModal}
                onCloseNewsModal={() => state.setShowNewsModal(false)}
                onSaveNews={async () => {
                  state.setSaving(true);
                  try {
                    // Save news logic
                  } finally {
                    state.setSaving(false);
                    state.setShowNewsModal(false);
                  }
                }}
                editingNews={state.editingNews}
                newsSaving={state.saving}
              />
            </>
          );
        }}
      </AdminStateManager>
    </div>
  );
}
