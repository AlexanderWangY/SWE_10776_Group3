import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/_auth";
import { userContext } from "~/context";

{/* LOADER FUNCTION */}
export async function loader({ context }: Route.LoaderArgs) {
    const user = context.get(userContext);

    {/* REDIRECT IF USER IS LOGGED IN */}
    if (user) {
        return redirect("/profile");
    }
}

{/* AUTH LAYOUT COMPONENT */}
export default function AuthLayout() {
  return <Outlet />;
}
