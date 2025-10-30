import { Button } from "@heroui/react";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "Gatormarket | Verified marketplace for UF students" },
    {
      name: "description",
      content:
        "Gatormarket is the student marketplace built by UF students for UF students!",
    },
  ];
}

export default function Root() {
  return (
    <main className="max-w-6xl mx-auto min-h-screen flex flex-col items-center">
      <section className="w-full pt-32 flex flex-col gap-3">
        <h1 className="text-5xl font-semibold">The Marketplace for Gators</h1>
        <h2 className="text-lg text-neutral-700 md:w-1/2">
          Buy and sell with verified UF students on UF&apos;s secondhand
          marketplace. Built for gators by gators.
        </h2>

        <div className="flex flex-row gap-2 mt-6">
          <Button
            href="/listings"
            variant="solid"
            size="lg"
            color="primary"
            className="w-fit"
            radius="sm"
          >
            <Link to="/listings">Browse</Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            color="primary"
            className="w-fit"
            radius="sm"
          >
            <Link to="/listings/new">Make a Listing</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
