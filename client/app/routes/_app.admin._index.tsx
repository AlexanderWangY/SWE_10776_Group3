import { Link, redirect } from "react-router";
import { Card, CardBody, CardHeader, Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import type { Route } from "./+types/_app.admin._index";
import { userContext } from "~/context";

{/* LOADER */}
export async function loader({ context, request }: Route.LoaderArgs) {
  const user = context.get(userContext);

  {/* AUTHENTICATION CHECK */}
  if (!user) {
    throw redirect(`/login?redirectTo=${request.url}`);
  }

  {/* ADMIN CHECK */}
  if (!user.is_superuser) {
    throw redirect("/");
  }

  return null;
}

{/* ADMIN DASHBOARD COMPONENT */}
export default function AdminDashboard() {
  return (
    <main className="max-w-7xl mx-auto pt-8 px-4 pb-10">
      {/* MAIN CONTENT AREA */}
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Admin Dashboard</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* WELCOME MESSAGE */}
      <div>
        <h2 className="text-xl text-gray-700 mb-6">
          Welcome to the Admin Dashboard. From here, you can manage users and listings on the platform. Use the cards below to navigate to the respective management sections.
        </h2>
      </div>
      
      {/* ADMIN MANAGEMENT CARDS */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/admin/users">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-primary">User Management</h2>
            </CardHeader>

            {/* USER MANAGEMENT CARD BODY */}
            <CardBody>
              <p className="text-gray-600">
                View and manage all users, check profiles, and monitor user activity.
              </p>
            </CardBody>
          </Card>
        </Link>

        {/* LISTING MANAGEMENT CARD */}
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
