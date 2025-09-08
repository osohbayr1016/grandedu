"use client";

import UniversityFormModal from "./UniversityFormModal";
import ProgramFormModal from "./ProgramFormModal";
import NewsFormModal from "./NewsFormModal";

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

interface AdminModalsProps {
  showUniversityModal: boolean;
  onCloseUniversityModal: () => void;
  onSaveUniversity: (university: Partial<University>) => Promise<void>;
  editingUniversity: University | null;
  universitySaving: boolean;

  showProgramModal: boolean;
  onCloseProgramModal: () => void;
  onSaveProgram: (program: Partial<Program>) => Promise<void>;
  editingProgram: Program | null;
  programSaving: boolean;

  showNewsModal: boolean;
  onCloseNewsModal: () => void;
  onSaveNews: (news: Partial<News>) => Promise<void>;
  editingNews: News | null;
  newsSaving: boolean;
}

export default function AdminModals({
  showUniversityModal,
  onCloseUniversityModal,
  onSaveUniversity,
  editingUniversity,
  universitySaving,

  showProgramModal,
  onCloseProgramModal,
  onSaveProgram,
  editingProgram,
  programSaving,

  showNewsModal,
  onCloseNewsModal,
  onSaveNews,
  editingNews,
  newsSaving,
}: AdminModalsProps) {
  return (
    <>
      <UniversityFormModal
        isOpen={showUniversityModal}
        onClose={onCloseUniversityModal}
        onSave={onSaveUniversity}
        editingUniversity={editingUniversity}
        saving={universitySaving}
      />

      <ProgramFormModal
        isOpen={showProgramModal}
        onClose={onCloseProgramModal}
        onSave={onSaveProgram}
        editingProgram={editingProgram}
        saving={programSaving}
      />

      <NewsFormModal
        isOpen={showNewsModal}
        onClose={onCloseNewsModal}
        onSave={onSaveNews}
        editingNews={editingNews}
        saving={newsSaving}
      />
    </>
  );
}
