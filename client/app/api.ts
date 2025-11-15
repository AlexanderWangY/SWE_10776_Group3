import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // cookie
});

export default api;

export type JSONResult<T> = {
  ok: boolean;
  status: number;
  unauthorized: boolean;
  data: T | null;
};

export async function getJSON<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<JSONResult<T>> {
  const res = await fetch(input, { credentials: "include", ...init });
  const unauthorized = res.status === 401 || res.status === 403;
  const ct = res.headers.get("content-type") || "";

  if (!ct.includes("application/json")) {
    // Backend returned text/plain or HTML; treat as invalid session or bad payload.
    return { ok: res.ok, status: res.status, unauthorized, data: null };
  }

  try {
    const data = (await res.json()) as T;
    return { ok: res.ok, status: res.status, unauthorized, data };
  } catch {
    return { ok: res.ok, status: res.status, unauthorized, data: null };
  }
}

export function isInvalidSession(result: JSONResult<unknown>) {
  return result.unauthorized || (!result.ok && result.data == null);
}