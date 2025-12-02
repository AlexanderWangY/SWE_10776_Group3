"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Link } from "react-router";
import ListingCard from "~/components/ListingCard";
import api from "~/api";
import type { Listing } from "~/components/listcard";

{/* ROOT PAGE WITH HERO SECTION AND LISTINGS CAROUSEL. */}
export default function Root() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  {/* FETCH LISTINGS */}
  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await api.get("/listings");
        setListings(res.data || []);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  {/* CAROUSEL EFFECT */}
  useEffect(() => {
    if (listings.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % listings.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [listings]);

  {/* HERO SECTION */}
  const Hero = (
    <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
      <h1 className="text-4xl sm:text-5xl font-semibold">
        The Marketplace for Gators
      </h1>
      <h2 className="text-base sm:text-lg text-neutral-700 md:w-4/5">
        Buy and sell with verified UF students on UF&apos;s secondhand
        marketplace. Built for gators by gators.
      </h2>

      <div className="flex flex-row gap-2 mt-6 justify-center md:justify-start flex-wrap">
        <Link to="/listings">
          <Button variant="solid" size="lg" color="primary" radius="sm">
            Browse
          </Button>
        </Link>
        <Link to="/listings/new">
          <Button variant="ghost" size="lg" color="primary" radius="sm">
            Make a Listing
          </Button>
        </Link>
      </div>
    </div>
  );

  {/* SKELETON CARD */}
  const SkeletonCard = (
    <div className="w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] animate-pulse">
      <div className="w-full aspect-square bg-gray-200 mb-1" />
      <div className="w-full h-5 bg-gray-200 mb-1" />
      <div className="w-3/4 h-4 bg-gray-200" />
    </div>
  );

  {/* PLACEHOLDER FOR NO LISTINGS */}
  const Placeholder = (
    <div className="w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px]">
      {/* WE COULD PUT A RANDOM IMAGE HERE TO MAKE IT MORE APPEALING IDK */}
      <img src="/placeholder.jpg" alt="No listings available" className="w-full aspect-square mb-1 rounded-xl" />
    </div>
  );

  {/* LOADING THE LISTINGS */}
  if (loading) {
    return (
      <main className="max-w-6xl mx-auto min-h-screen flex flex-col items-center px-4">
        <section className="w-full pt-24 flex flex-col md:flex-row gap-8 items-start">
          {Hero}
          <div className="flex-1 flex justify-center items-center w-full">
            {SkeletonCard}
          </div>
        </section>
      </main>
    );
  }

  {/* WHEN THERE ARE NO LISTINGS */}
  if (!loading && listings.length === 0) {
    return (
      <main className="max-w-6xl mx-auto min-h-screen flex flex-col items-center px-4">
        <section className="w-full pt-24 flex flex-col md:flex-row gap-8 items-start">
          {Hero}
          <div className="flex-1 flex justify-center items-center w-full">
            {Placeholder}
          </div>
        </section>
      </main>
    );
  }

  {/* CAROUSEL OF LISTINGS */}
  const currentListing = listings[currentIndex];

  return (
    <main className="max-w-6xl mx-auto min-h-screen flex flex-col items-center px-4">
      <section className="w-full pt-24 flex flex-col md:flex-row gap-8 items-start">
        {Hero}

        <div className="flex-1 flex justify-center md:justify-end items-center w-full">
          <ListingCard
            key={currentListing.id}
            id={currentListing.id}
            title={currentListing.title}
            price_cents={currentListing.price_cents}
            image_url={currentListing.image_url}
            className="w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px]"
          />
        </div>
      </section>
    </main>
  );
}
