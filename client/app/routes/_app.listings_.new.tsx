import { userContext } from "~/context";
import type { Route } from "./+types/_app.listings_.new";
import { redirect } from "react-router";

export function loader({ context, request }: Route.LoaderArgs) {
    const user = context.get(userContext);

    if (!user) {
        return redirect(`/login?redirectTo=${request.url}`);
    }

}

export default function NewListing() {
    return <div>New Listing Page</div>;
}