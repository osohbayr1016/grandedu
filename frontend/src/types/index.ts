// Shared type definitions for the application

export interface Entity {
  id: string;
  name: string;
  title?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  author?: string;
  content?: string;
  publishDate?: string;
  duration?: string;
  level?: string;
  price?: string;
  university?: string;
  requirements?: string;
  googleFormLink?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  userCode?: string;
  isActive: boolean;
  isHighlighted?: boolean;
  adminNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  adminNote?: string;
}

export interface Program {
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

export interface News {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price?: string;
  instructor?: string;
  schedule?: string;
  requirements?: string;
  imageUrl?: string;
  registrationLink?: string;
  adminNote?: string;
  isActive: boolean;
  isHighlighted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
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

export interface EntityStats {
  universities: Entity[];
  programs: Entity[];
  news: Entity[];
  users: Entity[];
}

export interface DashboardStats {
  totalUsers: number;
  totalPrograms: number;
  totalNews: number;
  totalUniversities: number;
  totalCourses: number;
}

export interface GroupedContent {
  [section: string]: {
    [field: string]: string;
  };
}
