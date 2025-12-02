import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { useNavigate } from "react-router";
import type { Listing } from "./listcard";

type ListingCardProps = Pick<
  Listing,
  "id" | "image_url" | "price_cents" | "title"
> & { className?: string };

{/*LIGHTWEIGHT LISTING TEASER CARD FOR GRID DISPLAYS.*/}
export default function ListingCard({ id, image_url, price_cents, title, className }: ListingCardProps) {
  const navigate = useNavigate();
  const priceDollars = (price_cents / 100).toFixed(2);

  return (
    // CARD IS PRESSABLE AND ROUTES TO THE LISTING DETAILS PAGE. //
    <Card
      isPressable
      disableAnimation
      shadow="none"
      radius="none"
      onClick={() => navigate(`/listings/${id}`)}
      className={`hover:cursor-pointer group ${className || "md:max-w-[200px]"}`}
    >
      <CardBody className="overflow-visible p-0">
        <Image
          alt={title}
          className="object-cover w-full aspect-square"
          radius="none"
          shadow="none"
          src={image_url || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
          width="100%"
        />
      </CardBody>
      <CardFooter className="flex flex-col items-start p-0 mt-1">
        <b className="md:text-md font-semibold group-hover:underline">{title}</b>
        <p className="text-default-700 text-sm">${priceDollars}</p>
      </CardFooter>
    </Card>
  );
}
