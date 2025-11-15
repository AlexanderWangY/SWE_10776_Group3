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

export const auth = {
  // Server side function to get the current user based on the auth cookie
  getUser: async (authCookie: string | null): Promise<User | null> => {
    if (!authCookie) return null;

    console.log("Fetching user with auth cookie:", authCookie);
    const result = await api.get("/profile", {
      headers: { Cookie: authCookie || "" },
      validateStatus: () => true,   // <-- THIS prevents Axios from throwing
    });

    // If unauthorized/forbidden, return null (no user logged in)
    if (result.status === 401 || result.status === 403) return null;

    if (result.status !== 200) {
      console.error("Failed to fetch user data:", result);
      return null;
    }

    // console.log("User data fetched successfully:", result.data); 

    const parseResult = UserSchema.safeParse(await result.data);
    if (!parseResult.success) {
      console.error("Failed to parse user data:", parseResult.error);
      return null;
    }

    return parseResult.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
    return;
  }
};
