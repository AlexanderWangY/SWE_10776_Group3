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
} from "@heroui/react";
import { z } from "zod";
import React from "react";

import ListingCard from "~/components/ListingCard";
import type { Listing } from "~/components/listcard";
import type { Route } from "./+types/_app.about";
import { Checkbox} from "@heroui/react";

{/* LISTBOX WRAPPER FOR CUSTOM STYLING */}
export const ListboxWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
    {children}
  </div>
);

{/* SCHEMAS FOR LISTING DATA VALIDATION */}
const sellerSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
});

{/* SORT OPTIONS FOR LISTINGS */}
const sortOptions = [
  { label: "Price: Low → High", query: "price&order=asc" },
  { label: "Price: High → Low", query: "price&order=desc" },
  { label: "Newest", query: "created_at&order=desc" },
  { label: "Oldest", query: "created_at&order=asc" },
];

{/* SCHEMA FOR A SINGLE LISTING */}
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

{/* MAIN LISTINGS PAGE COMPONENT */}
export default function ListingsPage({}: Route.ComponentProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [sortOption, setSortOption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const cardsPerPage = 40; // WE CAN CHANGE THIS IF U WANT //
  const [totalPages, setTotalPages] = useState<number>(1);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<number[]>([0, 1000]);

  {/* HANDLERS FOR CATEGORY AND CONDITION FILTERS */}
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(prev => prev === category ? "" : category);
  };

  {/* HANDLERS FOR CATEGORY AND CONDITION FILTERS */}
  const handleConditionChange = (condition: string) => {
    setSelectedCondition(prev => prev === condition ? "" : condition);
  };

  {/* FETCHES LISTINGS FROM API */}
  const fetchListings = async (
    sortQuery?: string,
    pageNum: number = page
  ) => {
    setLoading(true);
    setError(null);

    try {
      const apiURL = import.meta.env.VITE_API_URL;

      let filterParams = "&status=active";

      {/* APPLIES SORTING */}
      if (sortQuery) {
        const [sort_by, orderPart] = sortQuery.split("&");
        const order = orderPart?.split("=")[1];
        filterParams += `&sort_by=${sort_by}&order=${order}`;
      }

      {/* APPLIES SEARCH AND FILTERS */}
      if (searchTerm.trim()) {
        filterParams += `&keyword=${encodeURIComponent(searchTerm.trim())}`;
      }

      {/* APPLIES CATEGORY FILTER */}
      if (selectedCategory) {
        filterParams += `&category=${selectedCategory}`;
      }

      {/* APPLIES CONDITION FILTER */}
      if (selectedCondition) {
        filterParams += `&condition=${selectedCondition}`;
      }

      {/* APPLIES PRICE RANGE FILTER */}
      const [minPrice, maxPrice] = debouncedPriceRange;
      if (minPrice > 0) {
        filterParams += `&min_price=${minPrice * 100}`;
      }
      if (maxPrice < 1000) {
        filterParams += `&max_price=${maxPrice * 100}`;
      }

      const currentPageUrl = `${apiURL}/listings?page_num=${pageNum}&card_num=${cardsPerPage}${filterParams}`;
      const nextPageUrl = `${apiURL}/listings?page_num=${pageNum + 1}&card_num=${cardsPerPage}${filterParams}`;

      {/* FETCHES CURRENT AND NEXT PAGE */}
      const [currentRes, nextRes] = await Promise.all([
        fetch(currentPageUrl),
        fetch(nextPageUrl)
      ]);

      {/* CHECKS FOR ERRORS IN CURRENT PAGE RESPONSE */}
      if (!currentRes.ok) {
        const msg = await currentRes.json();
        throw new Error(msg.detail || `Error ${currentRes.status}`);
      }

        const [currentData, nextData] = await Promise.all([
          currentRes.json(),
          nextRes.ok ? nextRes.json() : []
        ]);

      {/* PARSES AND SETS LISTINGS */}
      if (Array.isArray(currentData)) {
        const parsed = listingsResponseSchema.parse(currentData);
        setListings(parsed);

        const hasNextPage = Array.isArray(nextData) && nextData.length > 0;

        {/* HANDLES CASE WHERE CURRENT PAGE IS EMPTY BUT PREVIOUS PAGES EXIST */}
        if (!hasNextPage && parsed.length === 0 && pageNum > 1) {
          const lastAvailablePage = pageNum - 1;
          setTotalPages(Math.max(1, lastAvailablePage));
          setPage(lastAvailablePage);
          return;
        }

        const computedTotalPages = hasNextPage ? pageNum + 1 : Math.max(1, pageNum);
        setTotalPages(computedTotalPages);
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

  {/* DEBOUNCE PRICE RANGE CHANGES */}
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 800);

    return () => clearTimeout(timer);
  }, [priceRange]);

  {/* RESET TO FIRST PAGE ON FILTER/SORT/SEARCH CHANGE */}
  useEffect(() => {
    setPage(1);
    setTotalPages(1);
  }, [sortOption, selectedCategory, selectedCondition, debouncedPriceRange, searchTerm]);

  {/* FETCH LISTINGS ON FILTER/SORT/SEARCH/PAGE CHANGE */}
  useEffect(() => {
    fetchListings(sortOption, page);
  }, [sortOption, page, selectedCategory, selectedCondition, debouncedPriceRange, searchTerm]);

  {/* RENDERS THE MAIN CONTENT */}
  return (
    <main className="max-w-7xl mx-auto pt-[1rem] xl:px-0 px-4 pb-10">
      <h1 className="text-2xl font-semibold mb-4">Browse Listings</h1>

      {/* SEARCH + SORT */}
      <div className="mt-4 grid gap-6 grid-cols-[minmax(0,1fr)_minmax(140px,160px)] sm:grid-cols-[minmax(0,1fr)_minmax(200px,260px)] items-start">
        <section className="flex-1 w-full">
          <div className="flex flex-col gap-4 w-full md:flex-row md:items-center">
            <Input
              size="lg"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:max-w-[70%]"
            />
            <div className="md:w-60 w-full">
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
            <div className="mt-4 md:mt-6 grid gap-3 grid-cols-[repeat(auto-fill,minmax(100px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,max-content))]">
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
              isDisabled={loading}
              onChange={(newPage) => {
                if (newPage >= 1 && newPage <= totalPages && !loading) {
                  setPage(newPage);
                }
              }}
            />
          </footer>
        </section>

        {/* RIGHT FILTER PANEL */}
        <aside className="w-full justify-self-end max-w-[200px] sm:max-w-none">
          <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
            <Card className="p-2 shadow-sm border border-gray-200">
              <CardHeader className="text-xs font-semibold pb-1 border-b border-neutral-200">
                Filters
              </CardHeader>

              <CardBody className="pt-2 space-y-1 text-xs text-default-600">
                {/* CATEGORY FILTER */}
                  <div className="mb-3">
                  <h3 className="text-xs font-semibold mb-1.5 text-default-700">
                    Category
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <Checkbox 
                      isSelected={selectedCategory === ""}
                      onValueChange={() => setSelectedCategory("")}
                      color="warning"
                    >
                      All Categories
                    </Checkbox>
                    <Checkbox 
                      isSelected={selectedCategory === "ELECTRONICS"}
                      onValueChange={() => handleCategoryChange("ELECTRONICS")}
                      color="warning"
                    >
                      Electronics
                    </Checkbox>
                    <Checkbox 
                      isSelected={selectedCategory === "FURNITURE"}
                      onValueChange={() => handleCategoryChange("FURNITURE")}
                      color="warning"
                    >
                      Furniture
                    </Checkbox>
                    <Checkbox 
                      isSelected={selectedCategory === "CLOTHING"}
                      onValueChange={() => handleCategoryChange("CLOTHING")}
                      color="warning"
                    >
                      Clothing
                    </Checkbox>
                    <Checkbox 
                      isSelected={selectedCategory === "SCHOOL_SUPPLIES"}
                      onValueChange={() => handleCategoryChange("SCHOOL_SUPPLIES")}
                      color="warning"
                    >
                      School Supplies
                    </Checkbox>
                    <Checkbox 
                      isSelected={selectedCategory === "APPLIANCES"}
                      onValueChange={() => handleCategoryChange("APPLIANCES")}
                      color="warning"
                    >
                      Appliances
                    </Checkbox>
                    <Checkbox 
                      isSelected={selectedCategory === "TEXTBOOKS"}
                      onValueChange={() => handleCategoryChange("TEXTBOOKS")}
                      color="warning"
                    >
                      Textbooks
                    </Checkbox>
                    <Checkbox 
                      isSelected={selectedCategory === "MISCELLANEOUS"}
                      onValueChange={() => handleCategoryChange("MISCELLANEOUS")}
                      color="warning"
                    >
                      Miscellaneous
                    </Checkbox>
                  </div>
                </div>

                {/* CONDITION FILTER */}
                  <div className="mb-3">
                  <h3 className="text-xs font-semibold mb-1.5 text-default-700">
                    Condition
                  </h3>

                  <div className="flex flex-col gap-1.5">
                    <Checkbox 
                      isSelected={selectedCondition === ""}
                      onValueChange={() => setSelectedCondition("")}
                      color="primary"
                    >
                      All Conditions
                    </Checkbox>
                    <Checkbox 
                      isSelected={selectedCondition === "NEW"}
                      onValueChange={() => handleConditionChange("NEW")}
                      color="primary"
                    >
                      New
                    </Checkbox>
                    <Checkbox 
                      isSelected={selectedCondition === "LIKE_NEW"}
                      onValueChange={() => handleConditionChange("LIKE_NEW")}
                      color="primary"
                    >
                      Like New
                    </Checkbox>
                    <Checkbox 
                      isSelected={selectedCondition === "VERY_GOOD"}
                      onValueChange={() => handleConditionChange("VERY_GOOD")}
                      color="primary"
                    >
                      Very Good
                    </Checkbox>
                    <Checkbox 
                      isSelected={selectedCondition === "GOOD"}
                      onValueChange={() => handleConditionChange("GOOD")}
                      color="primary"
                    >
                      Good
                    </Checkbox>
                    <Checkbox 
                      isSelected={selectedCondition === "USED"}
                      onValueChange={() => handleConditionChange("USED")}
                      color="primary"
                    >
                      Used
                    </Checkbox>
                  </div>
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
          </div>
        </aside>
      </div>
    </main>
  );
}
