import { Outlet, redirect, useOutletContext } from "react-router";
import { type User } from "~/libs/auth";
import { userContext } from "~/context";
import type { Route } from "./+types/_app._protected";

type ContextType = { user: User };

{/* LOADER */}
export async function loader({ context, request }: Route.LoaderArgs) {
  const user = context.get(userContext);

  {/* AUTHENTICATION CHECK */}
  if (!user) {
    {/* REDIRECT TO LOGIN WITH RETURN URL */}
    return redirect(`/login?redirectTo=${request.url}`);
  }

  {/* ADMIN CHECK */}
  if (!user.is_superuser) {
    {/* HOW DID U GET HERE??? */}
    return redirect("/");
  }

  return {
    user,
  };
}

{/* LAYOUT COMPONENT */}
export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return <Outlet context={{ user } satisfies ContextType} />;
}

{/* CUSTOM HOOK TO ACCESS USER CONTEXT */}
export function useUser() {
  return useOutletContext<ContextType>();
}
