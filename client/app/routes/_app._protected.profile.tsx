import { Link } from "react-router";
import { Avatar, Badge, Spinner } from "@heroui/react";
import type { Route } from "./+types/_app._protected.profile";
import { useUser } from "./_app._protected";
import { useEffect, useState } from "react";
import ListingCard from "~/components/ListingCard";
import { z } from "zod";
import api from "~/api";

{/* ZOD SCHEMA FOR LISTING */}
export const listingSchema = z
  .object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    price_cents: z.number(),
    status: z.enum(["active", "draft", "sold", "inactive", "archived"]),
    created_at: z.string(),
    updated_at: z.string(),
    image_url: z.string().optional(),
  })
  .passthrough(); 


const listingsResponseSchema = z.array(listingSchema);
type ListingResponse = z.infer<typeof listingsResponseSchema>

{/* STATUS STYLES FOR LISTING CARDS */}
const statusClasses: Record<z.infer<typeof listingSchema>["status"], string> = {
  active: "bg-green-200 text-green-800",
  draft: "bg-gray-200 text-gray-800",
  sold: "bg-red-200 text-red-800",
  inactive: "bg-yellow-200 text-yellow-800",
  archived: "bg-gray-400 text-white",
};

{/* PHONE NUMBER FORMATTING FUNCTION */}
const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  const digits = cleaned.slice(0, 10);

  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

{/* PROFILE COMPONENT */}
export default function Profile({}: Route.ComponentProps) {
  const { user } = useUser();

  const [listings, setListings] = useState<ListingResponse>();
  const [loading, setLoading] = useState(true);

  const hasName = user.first_name || user.last_name;
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  {/* FETCH LISTINGS */}
  const fetchListings = async () => {
    try {
      const res = await api.get("/profile/listings");

      const data = await res.data;
      console.log("Fetched listings:", data);

      const parsedListings = listingsResponseSchema.parse(data);
      setListings(parsedListings);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  {/* FETCH LISTINGS EFFECT */}
  useEffect(() => {
    fetchListings();
  }, []);

  {/* RENDER PROFILE PAGE */}
  return (
    <main className="min-h-screen w-full">
      <div className="max-w-4xl mx-auto pt-16 flex flex-col gap-4 px-6">
        {/* USER AVATAR AND ADMIN BADGE */}
        <div className="relative">
          {user.is_superuser && (
            <Badge color="primary" content="ADMIN" placement="bottom-right">
              <Avatar
              name={hasName ? fullName : undefined}
              src={user.profile_picture_url || "/GatorAvatarTemporary.png"}
              className="h-24 w-24"
              />
            </Badge>
          )}
          {!user.is_superuser && (
            <Avatar
            name={hasName ? fullName : undefined}
            src={user.profile_picture_url || "/GatorAvatarTemporary.png"}
            className="h-24 w-24"
            />
          )}
        </div>
        {/* USER NAME AND CONTACT INFO */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">
              {hasName ? fullName : "Anonymous User"}
            </h1>
            <Link
              to="/profile/edit"
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Edit
            </Link>
          </div>
          <p className="text-neutral-600 text-sm">{user.email}</p>
          {user.phone_number ? (
            <p className="text-neutral-600 text-sm">
              {formatPhoneNumber(user.phone_number)}
            </p>
          ) : (
            <Link
              to="/profile/edit"
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Add a phone number
            </Link>
          )}
        </div>

        {/* LISTINGS SECTION */}
        <div className="mt-12 flex flex-col gap-3 pb-6">
          <h2 className="text-2xl font-medium">My Listings</h2>
          <div className="w-full flex-row flex flex-wrap gap-3">
            {loading ? (
            <Spinner label="Loading your listings..." />
          ) : listings?.length === 0 ? (
            <p className="text-neutral-700 text-sm">You have no listings yet.</p>
          ) : (
            listings?.map((listing) => <ListingCard key={listing.id} {...listing} />)
          )}
          </div>
        </div>
      </div>
    </main>
  );
}
