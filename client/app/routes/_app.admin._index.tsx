import { Link, redirect } from "react-router";
import { Card, CardBody, CardHeader, Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import type { Route } from "./+types/_app.admin._index";
import { userContext } from "~/context";

export async function loader({ context, request }: Route.LoaderArgs) {
  const user = context.get(userContext);

  if (!user) {
    throw redirect(`/login?redirectTo=${request.url}`);
  }

  if (!user.is_superuser) {
    throw redirect("/");
  }

  return null;
}

export default function AdminDashboard() {
  return (
    <main className="max-w-7xl mx-auto pt-8 px-4 pb-10">
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Admin Dashboard</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div>
        <h2 className="text-xl text-gray-700 mb-6">
          Welcome to the Admin Dashboard. From here, you can manage users and listings on the platform. Use the cards below to navigate to the respective management sections.
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/admin/users">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-primary">User Management</h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">
                View and manage all users, check profiles, and monitor user activity.
              </p>
            </CardBody>
          </Card>
        </Link>

        <Link to="/admin/listings">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-primary">Listing Management</h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">
                Browse all listings, check status, and monitor marketplace activity.
              </p>
            </CardBody>
          </Card>
        </Link>
      </div>
    </main>
  );
}
