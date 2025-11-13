"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import AppNavbar from "~/components/navbar";
import { type Listing } from "~/components/listcard";
import { z } from "zod";
import type { Route } from "./+types/_app.about";
import ListingCard from "~/components/ListingCard";
import { Select, SelectItem, Input, Spinner } from "@heroui/react";

const sellerSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
});

const sortOptions = [
  { label: "Price: Low → High", query: "price&order=asc" },
  { label: "Price: High → Low", query: "price&order=desc" },
  { label: "Newest", query: "created_at&order=desc" },
  { label: "Oldest", query: "created_at&order=asc" },
];

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

const statusClasses: Record<Listing["status"], string> = {
  active: "bg-green-200 text-green-800",
  draft: "bg-gray-200 text-gray-800",
  sold: "bg-red-200 text-red-800",
  inactive: "bg-yellow-200 text-yellow-800",
  archived: "bg-gray-400 text-white",
};

export default function ListingsPage({}: Route.ComponentProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // FETCH LISTINGS FUNCTION
  const fetchListings = async (sortQuery?: string) => {
    setLoading(true);
    setError(null);
    try {
      const apiURL = import.meta.env.VITE_API_URL;
      let url = `${apiURL}/listings`;

      if (sortQuery && sortQuery.length > 0) {
        const [sort_by, orderPart] = sortQuery.split("&");
        const order = orderPart?.split("=")[1];
        url += `?sort_by=${sort_by}&order=${order}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 400) {
          const msg = await res.json();
          throw new Error(msg.detail || "Invalid sort option. Please try again.");
        }
        throw new Error(`Error fetching listings: ${res.status}`);
      }

      const data = await res.json();
      const parsedListings = listingsResponseSchema.parse(data);
      setListings(parsedListings);
    } catch (err: any) {
      console.error("Failed to fetch listings:", err);
      setError(err.message || "Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // REFETCH WHEN SORTOPTION CHANGES
  useEffect(() => {
    if (sortOption !== undefined) {
      fetchListings(sortOption);
    }
  }, [sortOption]);

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto pt-[1rem] xl:px-0 px-4 pb-10">
      <h1 className="text-2xl font-semibold">Browse Listings</h1>
      <div className="mt-2 flex gap-4 items-center">
        {/* SEARCH BAR */}
        <div className="w-full md:w-4xl">
          <Input
            label=""
            size="lg"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* SORT DROPDOWN */}
        <div className="md:w-46 w-full">
          <Select
            label="Sort by"
            size="sm"
            className="py-1"
            placeholder=""
            selectedKeys={sortOption ? [sortOption] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setSortOption(selected || "");
            }}
            items={sortOptions}
          >
            {(item) => <SelectItem key={item.query}>{item.label}</SelectItem>}
          </Select>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 text-red-600 bg-red-100 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="mt-8 flex justify-center">
          <Spinner label="Loading listings..." />
        </div>
      )}

      {/* LISTINGS*/}
      {!loading && !error && (
        <div
          className="
            mt-8
            grid
            gap-6
            grid-cols-[repeat(auto-fill,minmax(200px,max-content))]
          "
        >
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      )}
    </main>
  );
}
