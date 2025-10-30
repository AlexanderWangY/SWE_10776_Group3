import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import type { Route } from "./+types/_app.listings_.$id";

export async function loader({ params }: Route.LoaderArgs) {
    // You can fetch listing details here using params.id
    return {
        id: params.id,
        title: "Honda Fit 2013"
    };
}

export default function ListingDetails({ params, loaderData }: Route.ComponentProps) {
  return (
    <main className="max-w-7xl mx-auto pt-8 md:pt-12 xl:px-0 px-4">
      <Breadcrumbs>
        <BreadcrumbItem href="/listings">Listings</BreadcrumbItem>
        <BreadcrumbItem>{loaderData.title}</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className="text-2xl font-semibold mt-2">
        Listing details for {params.id}
      </h1>
    </main>
  );
}
