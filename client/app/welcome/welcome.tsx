"use client";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { useState, useEffect } from "react";
import ListingCard, { type Listing } from "~/components/listcard";


// JUST PLACEHOLDER DUMMY DATA... WE WILL BE PULLING FROM THE BACKEND JUST FOR A CUTE LITTLE AD IN THE FUTURE

const dummyListings: Listing[] = [
  {
    id: 1,
    seller_id: "1",
    title: "Calculus Textbook",
    description: "Brand new, 2024 edition. Includes solutions manual.",
    price_cents: 4500,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: "https://via.placeholder.com/400x300?text=Calculus+Textbook",
  },
  {
    id: 2,
    seller_id: "2",
    title: "Dorm Desk Chair",
    description: "Comfortable ergonomic chair, great condition.",
    price_cents: 2000,
    status: "sold",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: "https://via.placeholder.com/400x300?text=Dorm+Desk+Chair",
  },
  {
    id: 3,
    seller_id: "3",
    title: "UF Hoodie",
    description: "Official UF merchandise, size M, perfect for campus events.",
    price_cents: 3500,
    status: "draft",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: "https://via.placeholder.com/400x300?text=UF+Hoodie",
  },
];

// END OF PLACEHOLDER DUMMY DATA

// CALLED AT INDEX
export function Welcome() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dummyListings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentListing = dummyListings[currentIndex];

  const goPrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? dummyListings.length - 1 : prev - 1));
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % dummyListings.length);

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
          <ListingCard listing={currentListing} />
        </div>
      </CardBody>
    </Card>
  );
}
// END OF WELCOME FUNCTION THAT IS CALLED AT INDEX
