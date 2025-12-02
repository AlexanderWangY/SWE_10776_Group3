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
    return redirect(`/login?redirectTo=${request.url}`);
  }

  return {
    user,
  };
}

{/* PROTECTED LAYOUT COMPONENT */}
export default function ProtectedLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return <Outlet context={{ user } satisfies ContextType} />;
}

{/* CUSTOM HOOK TO ACCESS USER CONTEXT */}
export function useUser() {
  return useOutletContext<ContextType>();
}
