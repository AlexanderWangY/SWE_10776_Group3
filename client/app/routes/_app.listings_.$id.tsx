import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import type { Route } from "./+types/_app.listings_.$id";
import { redirect } from "react-router";
import { userContext } from "~/context";

// LOADER 
export async function loader({ params, context }: Route.LoaderArgs) {
  const user = context.get(userContext);

  if (!user) throw redirect("/login");

  const apiURL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${apiURL}/listings/${params.id}`);
  if (!res.ok) throw new Error("Failed to fetch listing");
  return { listing: await res.json(), user };
}

// FORMATS PHONE NUMBER PRETTY
function formatPhoneNumber(phone?: string | null) {
  if (!phone) return "No phone provided";
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;
  return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// ASSIGNS STATUSES TO COLORS FOR THE STATUS BADGE
function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-500 text-white";
    case "pending":
      return "bg-yellow-500 text-white";
    case "sold":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

export default function ListingDetails({ loaderData }: Route.ComponentProps) {
  const { listing } = loaderData;

  if (!listing) return <p>Listing not found.</p>;

  return (
    <main className="max-w-7xl mx-auto pt-8 md:pt-12 px-4">
      {/* BREADCRUMBS */}
      <div className="mb-6">
        <Breadcrumbs>
          <BreadcrumbItem href="/listings">Listings</BreadcrumbItem>
          <BreadcrumbItem>{listing.title}</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      {/* IMAGE + INFO */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* IMAGE */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={
              listing.image_url ||
              "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
            }
            alt={listing.title}
            className="w-full max-w-md md:max-w-full h-auto object-cover rounded-xl"
          />
        </div>

        {/* INFO */}
        <div className="w-full md:w-1/2 flex flex-col h-full">
          {/* TITLE & STATUS */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-2xl sm:text-3xl font-semibold break-words">
              {listing.title}
            </h1>
            <span
              className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                listing.status
              )}`}
            >
              {listing.status.toUpperCase()}
            </span>
          </div>

          {/* PRICE */}
          <p className="text-xl font-semibold text-gray-800 mt-4">{`$${(
            listing.price_cents / 100
          ).toFixed(2)}`}</p>

          {/* SELLER INFO */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Seller Info:</h2>
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm flex flex-col gap-1 text-gray-700 max-w-sm">
              <p>
                <b>Name:</b> {listing.seller?.first_name} {listing.seller?.last_name}
              </p>
              <p>
                <b>Phone:</b> {formatPhoneNumber(listing.seller?.phone_number)}
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          {listing.description && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Description:</h2>
              <div className="max-w-sm bg-blue-50 p-4 rounded-xl shadow-sm text-gray-700">
                <p>{listing.description}</p>
              </div>
            </div>
          )}

          {/* SPACER & CREATED AT */}
          <div className="mt-auto pt-12">
            <p className="text-xs text-gray-400">
              Created: {new Date(listing.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
