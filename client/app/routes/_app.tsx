import { Outlet } from "react-router";
import type { Route } from "./+types/_app";
import AppNavbar from "~/components/navbar";
import { userContext } from "~/context";

{/* LOADER FUNCTION */}
export function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return {
    user,
  };
}

{/* MAIN APP LAYOUT COMPONENT */}
export default function AppLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <>
      <AppNavbar user={user} />
      <Outlet />
    </>
  );
}
