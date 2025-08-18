"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getProgramsUrl } from "@/utils/api";

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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProgramsContextType {
  programs: Program[];
  updatePrograms: (programs: Program[]) => void;
  addProgram: (program: Program) => void;
  updateProgram: (id: string, program: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  toggleProgramStatus: (id: string) => void;
}

// Remove mock data - will be fetched from API

const ProgramsContext = createContext<ProgramsContextType | undefined>(
  undefined
);

export function ProgramsProvider({ children }: { children: ReactNode }) {
  const [programs, setPrograms] = useState<Program[]>([]);

  // Fetch programs from API on component mount
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(getProgramsUrl(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(10000),
        });

        if (response.ok) {
          const data = await response.json();
          setPrograms(data);
        } else {
          console.error("Failed to fetch programs:", response.status);
          setPrograms([]);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        setPrograms([]);
      }
    };

    fetchPrograms();
  }, []);

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
