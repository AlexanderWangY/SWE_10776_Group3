"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import AppNavbar from "~/components/navbar";
import { type Listing } from "~/components/listcard";
import { z } from "zod";
import type { Route } from "./+types/_app.about";
import ListingCard from "~/components/ListingCard";

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

const listingsReponseSchema = z.array(listingSchema);

const statusClasses: Record<Listing["status"], string> = {
  active: "bg-green-200 text-green-800",
  draft: "bg-gray-200 text-gray-800",
  sold: "bg-red-200 text-red-800",
  inactive: "bg-yellow-200 text-yellow-800",
  archived: "bg-gray-400 text-white",
};

export default function ListingsPage({}: Route.ComponentProps) {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    // FETCH LISTINGS FROM API //
    const fetchListings = async () => {
      try {
        const apiURL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiURL}/listings`);
        if (!res.ok) throw new Error(`Error fetching listings: ${res.status}`);
        const data = await res.json();
        const parsedListings = listingsReponseSchema.parse(data);
        setListings(parsedListings);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      }
    };

    fetchListings();
  }, []);

  const handleCardPress = (listing: Listing) => {
    alert(`Clicked on: ${listing.title}`);
  };

  return (
    <main className="max-w-7xl mx-auto pt-8 md:pt-12 xl:px-0 px-4">
      <h1 className="text-2xl font-semibold">Browse Listings</h1>

      <div
        className="
    mt-8
    grid
    gap-6
    grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
  "
      >
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            {...listing}
          />
        ))}
      </div>
    </main>
  );
}
