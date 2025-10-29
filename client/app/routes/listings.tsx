"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import AppNavbar from "~/components/navbar";
import { type Listing } from "~/components/listcard";
import { z } from "zod";

const sellerSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
});

export const listingSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price_cents: z.number(),
  status: z.enum(["active", "draft", "sold", "inactive", "archived"]),
  created_at: z.string(),
  updated_at: z.string(),
  image_url: z.string().optional(),
  seller: sellerSchema,
});

const listingsResponseSchema = z.array(listingSchema);

interface ListingsPageProps {
  user: any | null;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
}

export default function ListingsPage({ user, setUser }: ListingsPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 50);

    const fetchListings = async () => {
      try {
        const apiURL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiURL}/listings`);
        if (!res.ok) throw new Error(`Error fetching listings: ${res.status}`);
        const data = await res.json();
        const parsedListings = listingsResponseSchema.parse(data);
        setListings(parsedListings);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      }
    };

    fetchListings();

    return () => clearTimeout(timeout);
  }, []);

  const handleCardPress = (listing: Listing) => {
    alert(`Clicked on: ${listing.title}`);
  };

  const statusClasses: Record<Listing["status"], string> = {
    active: "bg-green-200 text-green-800",
    draft: "bg-gray-200 text-gray-800",
    sold: "bg-red-200 text-red-800",
    inactive: "bg-yellow-200 text-yellow-800",
    archived: "bg-gray-400 text-white",
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-tr from-orange-500 to-blue-500 flex flex-col items-center transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <AppNavbar user={user} setUser={setUser} />

      {/* CONTAINER CARD THAT HOLDS THE GRID */}
      <Card className="pt-10 w-full max-w-5xl bg-gradient-to-tr from-zinc-50/80 to-zinc-200/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 my-6 animate-fadeup">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing) => {
            const priceDollars = (listing.price_cents / 100).toFixed(2);

            return (
              <Card
                key={listing.id}
                className="cursor-pointer hover:scale-105 transition-transform flex flex-col rounded-2xl shadow-lg overflow-hidden"
                onClick={() => handleCardPress(listing)}
              >
                {listing.image_url && (
                  <CardHeader className="p-0">
                    <img
                      src={listing.image_url}
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                  </CardHeader>
                )}
                <CardBody className="p-4 flex flex-col flex-1">
                  <h2 className="text-lg font-bold line-clamp-2">{listing.title}</h2>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {listing.description}
                  </p>
                  <p className="text-md font-semibold mt-2">${priceDollars}</p>
                </CardBody>
                <CardFooter className="p-3 flex justify-between items-center text-xs text-gray-500">
                  <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-[0.65rem] font-semibold ${
                      statusClasses[listing.status]
                    }`}
                  >
                    {listing.status.toUpperCase()}
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
