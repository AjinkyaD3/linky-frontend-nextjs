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
  expiresAt: string | null;
  isOneTime: boolean;
  hasPassword: boolean;
  routingRules: RoutingRule[] | null;
}

export type RoutingType = "device" | "os" | "country";

export interface RoutingRule {
  type: RoutingType;
  value: string;
  url: string;
}

export interface BulkResult {
  index: number;
  success: boolean;
  link: UrlResponse | null;
  error: string | null;
}

export interface CreateUrlPayload {
  originalUrl: string;
  customAlias?: string;
  visibility?: Visibility;
  password?: string;
  isOneTime?: boolean;
  expiresAt?: string;
  routingRules?: RoutingRule[];
}

export interface UpdateUrlPayload {
  title?: string;
  description?: string;
  tags?: string[];
  originalUrl?: string;
  expiresAt?: string;
  clearExpiry?: boolean;
  routingRules?: RoutingRule[];
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
  topCities: TopItem[];
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

export interface OwnerPageLink {
  label: string;
  url: string;
  shortCode: string;
}

export interface OwnerPage {
  id: number;
  slug: string;
  title: string;
  bio: string | null;
  links: OwnerPageLink[];
}

export interface PagePayload {
  slug: string;
  title: string;
  bio?: string;
  links: { label: string; url: string }[];
}

export interface PublicPage {
  slug: string;
  title: string;
  bio: string | null;
  links: { label: string; shortCode: string }[];
}

export interface Webhook {
  id: number;
  url: string;
  events: string[];
  active: boolean;
  consecutiveFailures: number;
  disabledReason: string | null;
  createdAt: string;
  /** Only present in the response to creating a webhook. */
  secret?: string | null;
}

export interface Delivery {
  id: number;
  event: string;
  status: "PENDING" | "DELIVERED" | "FAILED";
  attempts: number;
  lastStatusCode: number | null;
  lastError: string | null;
  createdAt: string;
  deliveredAt: string | null;
}
