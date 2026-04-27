export interface SocialLinks {
  email?: string;
  linkedin?: string;
  googleScholar?: string;
  orcid?: string;
  personalSite?: string;
}

export type MemberRole = 'professor' | 'researcher' | 'student' | 'alumni';
export type MemberStatus = 'active' | 'alumni' | 'emeritus';

export interface Member {
  _id: string;
  fullName: string;
  role: MemberRole;
  status: MemberStatus;
  biography?: string;
  profileImage?: string;
  socialLinks: SocialLinks;
  joinedDate: string;
  leftDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkType = 'paper' | 'project' | 'patent' | 'thesis';
export type WorkStatus = 'in_progress' | 'published' | 'archived';

export interface Work {
  _id: string;
  title: string;
  type: WorkType;
  categoryId: string;
  description?: string;
  coverImage?: string;
  status: WorkStatus;
  completionDate?: string;
  featured: boolean;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export type AuthorshipRole = 'first' | 'corresponding' | 'co_author' | 'advisor' | 'contributor';

export interface Authorship {
  _id: string;
  workId: string;
  memberId: string;
  order: number;
  role: AuthorshipRole;
  contribution?: string;
}

export interface AuthorshipWithMember extends Authorship {
  member: Member;
}

export interface WorkWithAuthors extends Work {
  category: Category;
  authors: AuthorshipWithMember[];
}

export type CategoryDomain =
  | 'structural'
  | 'geotechnical'
  | 'transportation'
  | 'hydraulic'
  | 'materials'
  | 'other';

export interface Category {
  _id: string;
  name: string;
  domain: CategoryDomain;
  description?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export type UserAccessLevel = 'admin' | 'editor';

export interface User {
  _id: string;
  email: string;
  memberId: string | null;
  accessLevel: UserAccessLevel;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  _id: string;
  workId: string;
  kind: 'pdf' | 'image' | 'dataset' | 'video';
  fileUrl: string;
  caption?: string;
  sizeBytes?: number;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LikeCount {
  count: number;
  hasLiked: boolean;
}

export interface ApiError {
  statusCode: number;
  message: string;
}

export interface WorksQuery {
  [key: string]: string | number | boolean | undefined;
  category?: string;
  type?: WorkType;
  status?: WorkStatus;
  featured?: boolean;
  search?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface MembersQuery {
  [key: string]: string | undefined;
  role?: MemberRole;
  status?: MemberStatus;
  search?: string;
}
