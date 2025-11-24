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
  Slider,
  cn,
  Listbox,
  ListboxItem,
} from "@heroui/react";
import { z } from "zod";
import React from "react";

import ListingCard from "~/components/ListingCard";
import type { Listing } from "~/components/listcard";
import type { Route } from "./+types/_app.about";
import { Checkbox, CheckboxGroup } from "@heroui/react";

export const ListboxWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

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

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set([]));
  const [selectedConditions, setSelectedConditions] = useState<Set<string>>(new Set([]));
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<number[]>([0, 1000]);

  const fetchListings = async (
    sortQuery?: string,
    pageNum: number = page
  ) => {
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

      if (searchTerm.trim()) {
        url += `&keyword=${encodeURIComponent(searchTerm.trim())}`;
      }

      if (selectedCategories.size > 0) {
        selectedCategories.forEach(cat => {
          url += `&category=${cat}`;
        });
      }

      if (selectedConditions.size > 0) {
        selectedConditions.forEach(cond => {
          url += `&condition=${cond}`;
        });
      }

      const [minPrice, maxPrice] = debouncedPriceRange;
      if (minPrice > 0) {
        url += `&min_price=${minPrice * 100}`;
      }
      if (maxPrice < 1000) {
        url += `&max_price=${maxPrice * 100}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg.detail || `Error ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        const parsed = listingsResponseSchema.parse(data);
        setListings(parsed);

        if (parsed.length === cardsPerPage) {
          setTotalPages(pageNum + 1); 
        } else {
          setTotalPages(pageNum);
        }
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
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 800);

    return () => clearTimeout(timer);
  }, [priceRange]);

  useEffect(() => {
    setPage(1);
  }, [sortOption, selectedCategories, selectedConditions, debouncedPriceRange, searchTerm]);

  useEffect(() => {
    fetchListings(sortOption, page);
  }, [sortOption, page, selectedCategories, selectedConditions, debouncedPriceRange, searchTerm]);

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
            }}
            items={sortOptions}
          >
            {(item) => (
              <SelectItem key={item.query}>{item.label}</SelectItem>
            )}
          </Select>
        </div>

        {/* RIGHT FILTER PANEL */}
        <aside className="hidden sm:block fixed top-20 right-4 w-[220px] h-[calc(100vh-5rem)] overflow-y-auto z-50">
          <Card className="p-3 shadow-sm border border-gray-200">
            <CardHeader className="text-sm font-semibold pb-1 border-b border-neutral-200">
              Filters
            </CardHeader>

            <CardBody className="pt-3 space-y-2 text-sm text-default-600">
              {/* CATEGORY FILTER */}
                <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2 text-default-700">
                  Category
                </h3>

                <CheckboxGroup
                  value={[...selectedCategories]}
                  onChange={(vals) => {
                    setSelectedCategories(new Set(vals));
                  }}
                  className="flex flex-col gap-2"
                >
                  <Checkbox value="ELECTRONICS" color="warning">Electronics</Checkbox>
                  <Checkbox value="FURNITURE" color="warning">Furniture</Checkbox>
                  <Checkbox value="CLOTHING" color="warning">Clothing</Checkbox>
                  <Checkbox value="SCHOOL_SUPPLIES" color="warning">School Supplies</Checkbox>
                  <Checkbox value="APPLIANCES" color="warning">Appliances</Checkbox>
                  <Checkbox value="TEXTBOOKS" color="warning">Textbooks</Checkbox>
                  <Checkbox value="MISCELLANEOUS" color="warning">Miscellaneous</Checkbox>
                </CheckboxGroup>
              </div>

              {/* CONDITION DROPDOWN */}
                <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2 text-default-700">
                  Condition
                </h3>

                <CheckboxGroup
                  value={[...selectedConditions]}
                  onChange={(vals) => {
                    setSelectedConditions(new Set(vals));
                  }}
                  className="flex flex-col gap-2"
                >
                  <Checkbox value="NEW" color="primary">New</Checkbox>
                  <Checkbox value="LIKE_NEW" color="primary">Like New</Checkbox>
                  <Checkbox value="VERY_GOOD" color="primary">Very Good</Checkbox>
                  <Checkbox value="GOOD" color="primary">Good</Checkbox>
                  <Checkbox value="USED" color="primary">Used</Checkbox>
                </CheckboxGroup>
              </div>

              {/* PRICE RANGE SLIDER */}
              <Slider
                classNames={{
                  base: "max-w-md gap-3",
                  filler:
                    "bg-linear-to-r from-orange-300 to-blue-300 dark:from-orange-600 dark:to-blue-800",
                }}
                value={priceRange}
                onChange={(value) => {
                  setPriceRange(value as number[]);
                }}
                formatOptions={{
                  style: "currency",
                  currency: "USD",
                }}
                label="Price Range"
                maxValue={1000}
                size="md"
                step={1}
                renderThumb={({ index, ...props }) => (
                  <div
                    {...props}
                    className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
                  >
                    <span
                      className={cn(
                        "transition-transform bg-linear-to-br shadow-small rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80",
                        index === 0
                          ? "from-orange-200 to-orange-500 dark:from-orange-400 dark:to-orange-600"
                          : "from-blue-200 to-blue-600 dark:from-blue-400 dark:to-blue-700"
                      )}
                    />
                  </div>
                )}
              />
            </CardBody>
          </Card>
        </aside>
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

      {/* LISTINGS GRID */}
      {!loading && !error && (
        <div className="mt-8 grid gap-6 grid-cols-[repeat(auto-fill,minmax(200px,max-content))]">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              price_cents={listing.price_cents}
              image_url={listing.image_url || ""}
            />
          ))}
        </div>
      )}

      {/* PAGINATION */}
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
