import { apiFetch } from "./api-client";
import type {
  AdminStats,
  AnalyticsResponse,
  ApiKeyDto,
  BulkResult,
  CreateUrlPayload,
  Delivery,
  LoginResponse,
  OwnerPage,
  PagePayload,
  TagResponse,
  UpdateUrlPayload,
  UrlResponse,
  User,
  Webhook,
} from "./types";

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiFetch<void>("/api/auth/register", { method: "POST", body: data, skipAuth: true }),

  login: (data: { email: string; password: string }) =>
    apiFetch<LoginResponse>("/api/auth/login", { method: "POST", body: data, skipAuth: true }),

  refresh: (refreshToken: string) =>
    apiFetch<LoginResponse>("/api/auth/refresh", {
      method: "POST",
      body: { refreshToken },
      skipAuth: true,
      skipRefresh: true,
    }),

  logout: (refreshToken: string) =>
    apiFetch<void>("/api/auth/logout", {
      method: "POST",
      body: { refreshToken },
      skipRefresh: true,
    }),

  forgotPassword: (email: string) =>
    apiFetch<void>("/api/auth/forgot-password", {
      method: "POST",
      body: { email },
      skipAuth: true,
    }),

  resetPassword: (data: { token: string; newPassword: string }) =>
    apiFetch<void>("/api/auth/reset-password", { method: "POST", body: data, skipAuth: true }),
};

export const userApi = {
  me: () => apiFetch<User>("/api/users/me"),

  updateProfile: (data: { name: string; profileImage?: string }) =>
    apiFetch<User>("/api/users/me", { method: "PUT", body: data }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiFetch<void>("/api/users/me/password", { method: "PUT", body: data }),

  deleteAccount: () => apiFetch<void>("/api/users/me", { method: "DELETE" }),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<{ url: string }>("/api/users/me/avatar", {
      method: "POST",
      body: formData,
    });
  },
};

function pageQuery(params?: { page?: number; size?: number }) {
  if (params?.size === undefined) return "";
  return `?page=${params.page ?? 0}&size=${params.size}`;
}

export const urlApi = {
  create: (data: CreateUrlPayload) =>
    // Sends the access token when there is one so the link is owned by the signed-in user;
    // anonymous visitors simply have no token. (Relying on the cookie alone breaks cross-site.)
    apiFetch<UrlResponse>("/api/url", { method: "POST", body: data }),

  bulkCreate: (links: CreateUrlPayload[]) =>
    apiFetch<BulkResult[]>("/api/url/bulk", { method: "POST", body: { links } }),

  getById: (id: number) => apiFetch<UrlResponse>(`/api/url/${id}`),

  getMine: (params?: { search?: string; sort?: string; tag?: string; page?: number; size?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.sort) query.set("sort", params.sort);
    if (params?.tag) query.set("tag", params.tag);
    if (params?.size !== undefined) {
      query.set("size", String(params.size));
      query.set("page", String(params.page ?? 0));
    }
    const qs = query.toString();
    return apiFetch<UrlResponse[]>(`/api/url/my${qs ? `?${qs}` : ""}`);
  },

  getFavorites: (params?: { page?: number; size?: number }) =>
    apiFetch<UrlResponse[]>(`/api/url/my/favorites${pageQuery(params)}`),
  getArchived: (params?: { page?: number; size?: number }) =>
    apiFetch<UrlResponse[]>(`/api/url/my/archived${pageQuery(params)}`),

  toggleFavorite: (shortCode: string) =>
    apiFetch<UrlResponse>(`/api/url/${shortCode}/favorite`, { method: "PUT" }),

  toggleArchive: (shortCode: string) =>
    apiFetch<UrlResponse>(`/api/url/${shortCode}/archive`, { method: "PUT" }),

  duplicate: (shortCode: string) =>
    apiFetch<UrlResponse>(`/api/url/${shortCode}/duplicate`, { method: "POST" }),

  update: (shortCode: string, data: UpdateUrlPayload) =>
    apiFetch<UrlResponse>(`/api/url/${shortCode}`, { method: "PUT", body: data }),

  remove: (id: number) => apiFetch<void>(`/api/url/${id}`, { method: "DELETE" }),

  unlock: (shortCode: string, password: string) =>
    apiFetch<{ originalUrl: string }>(`/${shortCode}/unlock`, {
      method: "POST",
      body: { password },
      skipAuth: true,
    }),
};

export const tagApi = {
  list: () => apiFetch<TagResponse[]>("/api/tags"),
  create: (name: string) => apiFetch<TagResponse>("/api/tags", { method: "POST", body: { name } }),
  remove: (id: number) => apiFetch<void>(`/api/tags/${id}`, { method: "DELETE" }),
};

export const apiKeyApi = {
  list: () => apiFetch<ApiKeyDto[]>("/api/keys"),
  create: (name: string) => apiFetch<ApiKeyDto>("/api/keys", { method: "POST", body: { name } }),
  revoke: (id: number) => apiFetch<void>(`/api/keys/${id}`, { method: "DELETE" }),
};

export const analyticsApi = {
  get: (shortCode: string, days = 7) =>
    apiFetch<AnalyticsResponse>(`/api/analytics/${shortCode}?days=${days}`),
};

export const adminApi = {
  stats: () => apiFetch<AdminStats>("/api/admin/stats"),
  users: () => apiFetch<User[]>("/api/admin/users"),
  forceDeleteUrl: (id: number) =>
    apiFetch<void>(`/api/admin/urls/${id}`, { method: "DELETE" }),
};

export const pageApi = {
  mine: () => apiFetch<OwnerPage[]>("/api/pages"),
  create: (data: PagePayload) => apiFetch<OwnerPage>("/api/pages", { method: "POST", body: data }),
  update: (id: number, data: PagePayload) =>
    apiFetch<OwnerPage>(`/api/pages/${id}`, { method: "PUT", body: data }),
  remove: (id: number) => apiFetch<void>(`/api/pages/${id}`, { method: "DELETE" }),
};

export const webhookApi = {
  list: () => apiFetch<Webhook[]>("/api/webhooks"),
  create: (data: { url: string; events: string[] }) =>
    apiFetch<Webhook>("/api/webhooks", { method: "POST", body: data }),
  update: (id: number, data: { url?: string; events?: string[]; active?: boolean }) =>
    apiFetch<Webhook>(`/api/webhooks/${id}`, { method: "PUT", body: data }),
  remove: (id: number) => apiFetch<void>(`/api/webhooks/${id}`, { method: "DELETE" }),
  test: (id: number) => apiFetch<void>(`/api/webhooks/${id}/test`, { method: "POST" }),
  deliveries: (id: number) => apiFetch<Delivery[]>(`/api/webhooks/${id}/deliveries`),
};
