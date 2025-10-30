import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/_auth";
import { userContext } from "~/context";

export async function loader({ context }: Route.LoaderArgs) {
    const user = context.get(userContext);

    if (user) {
        return redirect("/profile");
    }
}

export default function AuthLayout() {
  return <Outlet />;
}
