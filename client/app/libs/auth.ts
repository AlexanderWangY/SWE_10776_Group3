import z from "zod";
import api from "~/api";

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  is_verified: z.boolean(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  is_superuser: z.boolean(),
  phone_number: z.string().nullable(),
  profile_picture_url: z.url().nullable(),
  profile_picture: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

/* AUTHENTICATION UTILITIES FOR USER SESSION MANAGEMENT */
export const auth = {
  /* FETCHES THE CURRENT USER VIA AUTH COOKIE, RETURNING NULL WHEN UNAUTHENTICATED.*/
  getUser: async (authCookie: string | null): Promise<User | null> => {
    if (!authCookie) return null;

    console.log("Fetching user with auth cookie:", authCookie);
    const result = await api.get("/profile", {
      headers: { Cookie: authCookie || "" },
      validateStatus: () => true,   // <-- THIS PREVENTS AXIOS FROM THROWING //
    });

    // IF UNAUTHORIZED/FORBIDDEN, RETURN NULL (NO USER LOGGED IN) //
    if (result.status === 401 || result.status === 403) return null;

    if (result.status !== 200) {
      console.error("Failed to fetch user data:", result);
      return null;
    }

    const parseResult = UserSchema.safeParse(await result.data);
    if (!parseResult.success) {
      console.error("Failed to parse user data:", parseResult.error);
      return null;
    }

    return parseResult.data;
  },

  /* INVALIDATES THE CURRENT SESSION VIA LOGOUT ENDPOINT. */
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
    return;
  }
};
