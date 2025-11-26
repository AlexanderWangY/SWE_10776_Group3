import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody } from "@heroui/react";
import type { Route } from "./+types/_app.admin.listings_.$id";
import { redirect, useNavigate } from "react-router";
import { userContext } from "~/context";
import { useState } from "react";

// LOADER 
export async function loader({ params, context }: Route.LoaderArgs) {
  const user = context.get(userContext);

  if (!user) throw redirect("/login");
  if (!user.is_superuser) throw redirect("/");

  const apiURL = import.meta.env.VITE_API_URL;
  const res = await fetch(`${apiURL}/listings/${params.id}`, {
    credentials: 'include',
  });
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
      return "bg-orange-500 text-white";
    case "pending":
      return "bg-orange-400 text-white";
    case "sold":
      return "bg-orange-200 text-orange-900";
    default:
      return "bg-gray-400 text-white";
  }
}

// ASSIGNS CATEGORY COLORS
function getCategoryColor(category: string) {
  switch (category.toLowerCase()) {
    default:
      return "bg-gray-400 text-white";
  }
}

// ASSIGNS CONDITION COLORS
function getConditionColor(condition: string) {
  switch (condition.toLowerCase()) {
    case "new":
      return "bg-blue-600 text-white";
    case "like new":
      return "bg-blue-500 text-white";
    case "very good":
      return "bg-blue-400 text-blue-900"; 
    case "good":
      return "bg-blue-300 text-blue-900";
    case "used":
      return "bg-blue-200 text-blue-900";
    default:
      return "bg-gray-400 text-white";
  }
}

// FORMAT CATEGORY/CONDITION TEXT
function formatLabel(text: string) {
  return text.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminListingDetails({ loaderData }: Route.ComponentProps) {
  const { listing } = loaderData;
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!listing) return <p>Listing not found.</p>;

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete listing: ${listing.title}?`)) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const apiURL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiURL}/listings/${listing.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        throw new Error(msg.detail || 'Failed to delete listing');
      }

      navigate('/admin/listings');
    } catch (err: any) {
      setError(err.message || 'Failed to delete listing');
    } finally {
      setDeleting(false);
    }
  };

  return (
      <main className="max-w-7xl mx-auto pt-8 md:pt-12 px-4">
        {/* BREADCRUMBS */}
        <div className="mb-6">
          <Breadcrumbs>
            <BreadcrumbItem href="/admin">Admin Dashboard</BreadcrumbItem>
            <BreadcrumbItem href="/admin/listings">Listings</BreadcrumbItem>
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
            {/* TITLE & BADGES */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-semibold break-words">
                {listing.title}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    listing.status
                  )}`}
                >
                  {listing.status.toUpperCase()}
                </span>
                {listing.category && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                      listing.category
                    )}`}
                  >
                    {formatLabel(listing.category.toUpperCase())}
                  </span>
                )}
                {listing.condition && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(
                      listing.condition
                    )}`}
                  >
                    {formatLabel(listing.condition).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
  
            {/* PRICE */}
            <p className="text-xl font-semibold text-gray-800 mt-4">{`$${(
              listing.price_cents / 100
            ).toFixed(2)}`}</p>

            {/* LISTING ID */}
          <p className="text-sm text-gray-600 mt-2">
            <b>Listing ID:</b> {listing.id}
          </p>
  
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

            {/* DELETE LISTING BUTTON */}
            <div className="mt-8">
              <Button
                size="md"
                radius="lg"
                color="danger"
                variant="flat"
                onPress={handleDelete}
                isLoading={deleting}
              >
                Delete Listing
              </Button>
              {error && (
                <p className="text-sm text-red-600 mt-2">
                  {error}
                </p>
              )}
            </div>  
  
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
  