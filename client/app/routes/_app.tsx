import { Outlet } from "react-router";
import type { Route } from "./+types/_app";
import AppNavbar from "~/components/navbar";
import { userContext } from "~/context";

export function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return {
    user,
  };
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <>
      <AppNavbar user={user} />
      <Outlet />
    </>
  );
}
