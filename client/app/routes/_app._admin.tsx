import { Outlet, redirect, useOutletContext } from "react-router";
import { type User } from "~/libs/auth";
import { userContext } from "~/context";
import type { Route } from "./+types/_app._protected";

type ContextType = { user: User };

export async function loader({ context, request }: Route.LoaderArgs) {
  const user = context.get(userContext);

  if (!user) {
    return redirect(`/login?redirectTo=${request.url}`);
  }

  // ADMIN CHECK
  if (!user.is_superuser) {
    // HOW DID U GET HERE???
    return redirect("/");
  }

  return {
    user,
  };
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return <Outlet context={{ user } satisfies ContextType} />;
}

export function useUser() {
  return useOutletContext<ContextType>();
}
