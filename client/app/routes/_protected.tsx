import { Outlet, redirect, useOutletContext } from "react-router";
import type { Route } from "./+types/_protected";
import { auth, type User } from "~/libs/auth";

type ContextType = { user: User };

export async function loader({ request }: Route.LoaderArgs) {
  const authCookie = request.headers.get("Cookie");

  const user = await auth.getUser(authCookie);

  if (!user) {
    return redirect("/login");
  }

  return {
    user,
  };
}

export default function ProtectedLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return <Outlet context={{ user } satisfies ContextType} />;
}

export function useUser() {
    return useOutletContext<ContextType>();
  }
  
