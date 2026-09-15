export type Role = "USER" | "ADMIN";
export type Visibility = "PUBLIC" | "PRIVATE";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  profileImage?: string | null;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
  role: Role;
}

export interface UrlResponse {
  id: number;
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  clickCount: number;
  title: string | null;
  description: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  visibility: Visibility;
  tags: string[] | null;
}

export interface CreateUrlPayload {
  originalUrl: string;
  customAlias?: string;
  visibility?: Visibility;
  password?: string;
  isOneTime?: boolean;
}

export interface UpdateUrlPayload {
  title?: string;
  description?: string;
  tags?: string[];
}

export interface TagResponse {
  id: number;
  name: string;
}

export interface ApiKeyDto {
  id: number;
  name: string;
  keyValue: string;
  createdAt: string;
}

export interface ClickOverTime {
  date: string;
  count: number;
}

export interface TopItem {
  name: string;
  count: number;
}

export interface AnalyticsResponse {
  shortCode: string;
  totalClicks: number;
  clicksOverTime: ClickOverTime[];
  topBrowsers: TopItem[];
  topDevices: TopItem[];
  topCountries: TopItem[];
  topReferrers: TopItem[];
}

export interface AdminStats {
  totalUsers: number;
  totalUrls: number;
  totalClicks: number;
}

export interface ApiErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  details?: Record<string, string>;
}
