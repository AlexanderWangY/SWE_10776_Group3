"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Select,
  SelectItem,
  Input,
  Pagination,
} from "@heroui/react";
import { z } from "zod";
import { type Listing } from "~/components/listcard";
import ListingCard from "~/components/ListingCard";
import type { Route } from "./+types/_app.about";

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
  description: z.string().optional(),
  price_cents: z.number(),
  status: z.enum(["active", "draft", "sold", "inactive", "archived"]),
  created_at: z.string(),
  updated_at: z.string(),
  image_url: z.string().optional(),
  seller: sellerSchema,
  category: z.enum(["electronics", "school supplies", "furniture", "appliances", "clothing", "textbooks", "miscellaneous"]).nullable().optional(),
  condition: z.enum(["new", "like new", "very good", "good", "used"]).nullable().optional(),
});

const listingsResponseSchema = z.array(listingSchema);

export default function ListingsPage({}: Route.ComponentProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [page, setPage] = useState<number>(1);
  const cardsPerPage = 40; // WE CAN CHANGE THIS IF U WANT
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchListings = async (sortQuery?: string, pageNum: number = page) => {
    setLoading(true);
    setError(null);
    try {
      const apiURL = import.meta.env.VITE_API_URL;
      let url = `${apiURL}/listings?page_num=${pageNum}&card_num=${cardsPerPage}`;

      if (sortQuery) {
        const [sort_by, orderPart] = sortQuery.split("&");
        const order = orderPart?.split("=")[1];
        url += `&sort_by=${sort_by}&order=${order}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg.detail || `Error ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        const parsedListings = listingsResponseSchema.parse(data);
        setListings(parsedListings);

        // PLACEHOLDER
        setTotalPages(5);
      } else {
        setListings([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error("Failed to fetch listings:", err);
      setError(err.message || "Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(sortOption, page);
  }, [sortOption, page]);

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto pt-[1rem] xl:px-0 px-4 pb-10">
      <h1 className="text-2xl font-semibold mb-4">Browse Listings</h1>

      {/* SEARCH + SORT */}
      <div className="mt-2 flex gap-4 items-center">
        <div className="w-full md:w-4xl">
          <Input
            size="lg"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="md:w-46 w-full">
          <Select
            label="Sort by"
            size="sm"
            className="py-1"
            selectedKeys={sortOption ? [sortOption] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setSortOption(selected || "");
              setPage(1); // RESETS ON SORT CHANGE
            }}
            items={sortOptions}
          >
            {(item) => <SelectItem key={item.query}>{item.label}</SelectItem>}
          </Select>
        </div>

        {/* RIGHT FILTER ITS SUPPOSED TO BE FIXED BUT IT MOVES ON SCROLL HELP MEEEEEE*/}
        <aside className="hidden sm:block fixed top-20 right-4 w-[220px] h-[calc(100vh-5rem)] overflow-y-auto z-50">
          <Card className="p-3 shadow-sm border border-gray-200">
            <CardHeader className="text-sm font-semibold pb-1 border-b border-neutral-200">
              Filters (Coming Soon)
            </CardHeader>
            <CardBody className="pt-3 space-y-2 text-sm text-default-600">
              <p>hewwo hewwo hewwo hewwo hewwo hewwo hewwo hewwo hewwo hewwo</p>
            </CardBody>
          </Card>
        </aside>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 text-red-600 bg-red-100 p-3 rounded-md">{error}</div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="mt-8 flex justify-center">
          <Spinner label="Loading listings..." />
        </div>
      )}

      {/* LISTINGS GRID */}
      {!loading && !error && (
        <div className="mt-8 grid gap-6 grid-cols-[repeat(auto-fill,minmax(200px,max-content))]">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      )}

      {/* PAGINATION UI */}
      <footer className="mt-8 flex justify-start">
        <Pagination
          page={page}
          total={totalPages}
          size="lg"
          variant="light"
          showControls={true}
          onChange={(newPage) => setPage(newPage)}
        />
      </footer>
    </main>
  );
}