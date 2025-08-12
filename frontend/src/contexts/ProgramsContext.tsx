"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  imageUrl: string;
  googleFormLink: string;
  isActive: boolean;
}

interface ProgramsContextType {
  programs: Program[];
  updatePrograms: (programs: Program[]) => void;
  addProgram: (program: Program) => void;
  updateProgram: (id: string, program: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  toggleProgramStatus: (id: string) => void;
}

const defaultPrograms: Program[] = [
  {
    id: "1",
    title: "Бакалаврын хөтөлбөр",
    description: "4 жилийн бакалаврын зэрэг",
    duration: "4 жил",
    level: "Бакалавр",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=800&h=600&fit=crop",
    googleFormLink: "https://forms.google.com/bachelor",
    isActive: true,
  },
  {
    id: "2",
    title: "Магистрын хөтөлбөр",
    description: "2 жилийн магистрын зэрэг",
    duration: "2 жил",
    level: "Магистр",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    googleFormLink: "https://forms.google.com/master",
    isActive: true,
  },
  {
    id: "3",
    title: "Докторын хөтөлбөр",
    description: "3-4 жилийн докторын зэрэг",
    duration: "3-4 жил",
    level: "Доктор",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    googleFormLink: "https://forms.google.com/phd",
    isActive: true,
  },
];

const ProgramsContext = createContext<ProgramsContextType | undefined>(
  undefined
);

export function ProgramsProvider({ children }: { children: ReactNode }) {
  const [programs, setPrograms] = useState<Program[]>(defaultPrograms);

  const updatePrograms = (newPrograms: Program[]) => {
    setPrograms(newPrograms);
  };

  const addProgram = (program: Program) => {
    setPrograms((prev) => [...prev, program]);
  };

  const updateProgram = (id: string, updatedProgram: Partial<Program>) => {
    setPrograms((prev) =>
      prev.map((program) =>
        program.id === id ? { ...program, ...updatedProgram } : program
      )
    );
  };

  const deleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((program) => program.id !== id));
  };

  const toggleProgramStatus = (id: string) => {
    setPrograms((prev) =>
      prev.map((program) =>
        program.id === id
          ? { ...program, isActive: !program.isActive }
          : program
      )
    );
  };

  return (
    <ProgramsContext.Provider
      value={{
        programs,
        updatePrograms,
        addProgram,
        updateProgram,
        deleteProgram,
        toggleProgramStatus,
      }}
    >
      {children}
    </ProgramsContext.Provider>
  );
}

export function usePrograms() {
  const context = useContext(ProgramsContext);
  if (context === undefined) {
    throw new Error("usePrograms must be used within a ProgramsProvider");
  }
  return context;
}
