"use client";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { useState, useEffect } from "react";
import ListingCard, { type Listing } from "~/components/listcard";
import {z} from "zod";

const listingSchema = z.object({
  id: z.number(),
  seller_id: z.string(),
  title: z.string(),
  description: z.string(),
  price_cents: z.number(),
  status: z.enum(["active", "draft", "sold", "inactive", "archived"]),
  created_at: z.string(),
  updated_at: z.string(),
  image_url: z.string().optional(),
});

const listingsReponseSchema = z.array(listingSchema);

// CALLED AT INDEX
export function Welcome() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const apiURL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiURL}/listings`)
        if (!res.ok) throw new Error(`Error fetching listings: ${res.status}`);
        const data = await res.json();
        const parsedListings = listingsReponseSchema.parse(data);
        setListings(parsedListings);
      }
      catch (err) {
        console.error("Failed to fetch listings:", err);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % listings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [listings]);

  const currentListing = listings[currentIndex];

  const goPrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? listings.length - 1 : prev - 1));
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % listings.length);

  return (
    // WE CAN ALWAYS CHANGE THIS SLOGAN AND BLURB
    <Card className="max-w-4xl shadow-2xl shadow-blue-950/40 bg-gradient-to-tr from-white/80 to-blue-50/80 rounded-3xl p-6 backdrop-blur-lg animate-fadeup">
      <CardHeader className="flex flex-col items-center pb-2">
        <h1 className="text-blue-950 font-extrabold text-4xl text-center">
          Buy. Sell. On. Campus.
        </h1>
        <p className="text-gray-600 text-center mt-6 ">
          Gatormarket is your university peer-to-peer marketplace where students can exchange textbooks, dorm essentials, clothes, and more — all verified with UF Emails for safety and trust.
        </p>
      </CardHeader>

      <CardBody className="flex flex-col items-center">
        <h2>
          <text className="text-blue-950 font-medium text-2xl">
            Explore Listings:
          </text>
        </h2>
        
        {/* CAROUSEL LISTINGS */}
        <div className="w-full pt-4">
          {listings.length > 0 ? (
            <ListingCard listing={listings[currentIndex]} />
          ) : (
            <p className="text-gray-500 text-lg mt-6">Loading listings...</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
// END OF WELCOME FUNCTION THAT IS CALLED AT INDEX
