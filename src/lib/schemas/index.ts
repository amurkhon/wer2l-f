import { z } from 'zod';

export const socialLinksSchema = z.object({
  email: z.union([z.string().email(), z.literal('')]).optional(),
  linkedin: z.union([z.string().url(), z.literal('')]).optional(),
  googleScholar: z.union([z.string().url(), z.literal('')]).optional(),
  orcid: z.union([z.string().url(), z.literal('')]).optional(),
  personalSite: z.union([z.string().url(), z.literal('')]).optional(),
});

export const memberSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  role: z.enum(['professor', 'researcher', 'student', 'alumni']),
  status: z.enum(['active', 'alumni', 'emeritus']).default('active'),
  biography: z.string().optional(),
  profileImage: z.string().optional(),
  socialLinks: socialLinksSchema.default({}),
  joinedDate: z.string().min(1, 'Joined date is required'),
  leftDate: z.string().optional(),
});

export type MemberFormValues = z.infer<typeof memberSchema>;

export const workSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['paper', 'project', 'patent', 'thesis']),
  paperUrl: z.union([z.string().url('Enter a valid URL'), z.literal('')]).optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(['in_progress', 'published', 'archived']).default('in_progress'),
  completionDate: z.string().optional(),
  featured: z.boolean().default(false),
});

export type WorkFormValues = z.infer<typeof workSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  domain: z.enum(['structural', 'geotechnical', 'transportation', 'hydraulic', 'materials', 'other']),
  description: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  accessLevel: z.enum(['admin', 'editor']),
  memberId: z.string().optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const authorshipSchema = z.object({
  role: z.enum(['first', 'corresponding', 'co_author', 'advisor', 'contributor']),
  contribution: z.string().optional(),
});

export type AuthorshipFormValues = z.infer<typeof authorshipSchema>;
