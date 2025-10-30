import z from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  is_verified: z.boolean(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  is_superuser: z.boolean(),
  phone_number: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export const auth = {
  getUser: async (authCookie: string | null): Promise<User | null> => {
    console.log("Fetching user with auth cookie:", authCookie);
    const result = await fetch("http://localhost:8080/auth/me", {
      method: "GET",
      headers: {
        Cookie: authCookie || "",
      },
    });

    // If unauthorized/forbidden, return null (no user logged in)
    if (result.status === 401 || result.status === 403) return null;

    // Ensure response is JSON
    const contentType = result.headers.get("Content-Type") || "";
    if (!contentType.includes("application/json")) {
      console.warn("Response is not JSON, returning null");
      return null;
    }

    const parseResult = UserSchema.safeParse(await result.json());
    if (!parseResult.success) {
      console.error("Failed to parse user data:", parseResult.error);
      return null;
    }

    return parseResult.data;
  },
};
