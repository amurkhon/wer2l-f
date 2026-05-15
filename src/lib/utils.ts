import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | undefined, fmt = 'MMM d, yyyy'): string {
  if (!date) return '—';
  return format(new Date(date), fmt);
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const MEMBER_ROLE_LABELS: Record<string, string> = {
  professor: 'Professor',
  researcher: 'Researcher',
  student: 'Student',
  alumni: 'Alumni',
};

export const MEMBER_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  alumni: 'Alumni',
  emeritus: 'Emeritus',
};

export const WORK_TYPE_LABELS: Record<string, string> = {
  paper: 'Paper',
  project: 'Project',
  patent: 'Patent',
  thesis: 'Thesis',
};

export const WORK_STATUS_LABELS: Record<string, string> = {
  in_progress: 'In Progress',
  published: 'Published',
  archived: 'Archived',
};

export const AUTHORSHIP_ROLE_LABELS: Record<string, string> = {
  first: 'First Author',
  corresponding: 'Corresponding',
  co_author: 'Co-Author',
  advisor: 'Advisor',
  contributor: 'Contributor',
};

export const HIGHLIGHT_TYPE_LABELS: Record<string, string> = {
  news: 'News',
  award: 'Award',
  publication: 'Publication',
  event: 'Event',
};

export const CATEGORY_DOMAIN_LABELS: Record<string, string> = {
  structural: 'Structural',
  geotechnical: 'Geotechnical',
  transportation: 'Transportation',
  hydraulic: 'Hydraulic',
  materials: 'Materials',
  other: 'Other',
};

export function roleSort(role: string): number {
  const order: Record<string, number> = {
    professor: 0,
    researcher: 1,
    student: 2,
    alumni: 3,
  };
  return order[role] ?? 99;
}

export function generateAnonymousId(): string {
  return crypto.randomUUID();
}

export const SITE_NAME = 'Water Environment & Resource Recovery Lab';
export const SITE_TAGLINE = 'Advancing Civil Engineering Through Research and Innovation';
