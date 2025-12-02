export interface AdminUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_superuser: boolean;
  is_verified: boolean;
  is_banned: boolean;
  phone_number: string | null;
  profile_picture_url?: string | null;
}

const API_URL = import.meta.env.VITE_API_URL;

type AdminUserResult = Promise<AdminUser>;

{/* BUILDS FETCH OPTIONS WITH AUTHENTICATED COOKIES AND JSON HEADERS. */}
const buildOptions = (init?: RequestInit): RequestInit => ({
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    ...(init?.headers || {}),
  },
  ...init,
});

{/* NORMALIZES API RESPONSES, RAISING ERRORS WHEN REQUESTS FAIL. */}
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body?.detail) {
        message = typeof body.detail === "string" ? body.detail : message;
      }
    } catch (error) {
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

{/* RETRIEVES DETAILED INFORMATION FOR A SPECIFIC USER.*/}
export const fetchAdminUser = async (userId: string): AdminUserResult => {
  return handleResponse<AdminUser>(
    await fetch(`${API_URL}/admin/users/${userId}`, buildOptions())
  );
};

{/* FLAGS A USER AS BANNED AND RETURNS UPDATED ACCOUNT DATA. */}
export const banAdminUser = async (userId: string): AdminUserResult => {
  return handleResponse<AdminUser>(
    await fetch(`${API_URL}/admin/users/${userId}/ban`, buildOptions({ method: "POST" })),
  );
};

{/* REVERSES A BAN STATUS FOR THE GIVEN USER. */}
export const unbanAdminUser = async (userId: string): AdminUserResult => {
  return handleResponse<AdminUser>(
    await fetch(`${API_URL}/admin/users/${userId}/unban`, buildOptions({ method: "POST" }))
  );
};