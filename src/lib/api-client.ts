import { useAuthStore } from "./auth-store";
import type { ApiErrorBody, LoginResponse } from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  details?: Record<string, string>;

  constructor(message: string, status: number, details?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip the Authorization header (e.g. for register/login/refresh themselves) */
  skipAuth?: boolean;
  /** Skip the automatic silent-refresh-and-retry on a 401 */
  skipRefresh?: boolean;
}

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

async function parseErrorBody(res: Response): Promise<ApiErrorBody> {
  try {
    const data = await res.json();
    return data as ApiErrorBody;
  } catch {
    return { message: res.statusText || `Request failed (${res.status})` };
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, setSession, user, clear } = useAuthStore.getState();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) {
          clear();
          return null;
        }
        const data: LoginResponse = await res.json();
        setSession({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: user ?? { name: data.name, email: data.email, role: data.role },
        });
        return data.accessToken;
      })
      .catch(() => {
        clear();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, skipAuth, skipRefresh, headers, ...rest } = options;

  const doFetch = async (): Promise<Response> => {
    const finalHeaders = new Headers(headers);
    const formData = isFormData(body);
    if (body !== undefined && !formData && !finalHeaders.has("Content-Type")) {
      finalHeaders.set("Content-Type", "application/json");
    }
    if (!skipAuth) {
      const token = useAuthStore.getState().accessToken;
      if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${API_URL}${path}`, {
      ...rest,
      credentials: "include",
      headers: finalHeaders,
      body: formData
        ? (body as FormData)
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  };

  let res = await doFetch();

  if (res.status === 401 && !skipAuth && !skipRefresh) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doFetch();
    }
  }

  if (!res.ok) {
    const errorBody = await parseErrorBody(res);
    throw new ApiError(
      errorBody.message ?? `Request failed (${res.status})`,
      res.status,
      errorBody.details
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return undefined as T;
}

export function shortLinkUrl(shortCode: string): string {
  return `${API_URL}/${shortCode}`;
}

export function qrCodeUrl(shortCode: string, format: "png" | "svg" = "png"): string {
  return `${API_URL}/api/url/${shortCode}/qrcode?format=${format}`;
}
