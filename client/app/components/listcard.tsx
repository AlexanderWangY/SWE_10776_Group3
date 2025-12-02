"use client";
import { useState } from "react";

export type ListingStatus = "draft" | "active" | "sold" | "inactive" | "archived";
export type ListingCategory = "electronics" | "school supplies" | "furniture" | "appliances" | "clothing" | "textbooks" | "miscellaneous";
export type ListingCondition = "new" | "like new" | "very good" | "good" | "used";

export interface Seller {
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface Listing {
  id: number;
  title: string;
  description?: string;
  price_cents: number;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
  image_url?: string; // IMAGE IS OPTIONAL IN BACKEND //
  seller: Seller;
  category?: ListingCategory | null;
  condition?: ListingCondition | null;
}

type ListingCardProps = {
  listing: Listing;
  onEdit?: (listing: Listing) => void;
};

{/* NORMALIZES RAW PHONE INPUT INTO (XXX) XXX-XXXX OR FALLBACK TEXT.*/}
function formatPhoneNumber(phone: string | undefined): string {
  if (!phone) return "No phone provided";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return digits.length > 0 ? phone : "No phone provided";
}

{/*VISUAL CARD DISPLAY FOR A SINGLE LISTING WITH OPTIONAL CALL-TO-ACTION.*/}
export default function ListingCard({ listing, onEdit }: ListingCardProps) {
  const [showDescription, setShowDescription] = useState(false);
  const priceDollars = (listing.price_cents / 100).toFixed(2);

  const statusClasses = {
    active: "bg-green-200 text-green-800",
    draft: "bg-gray-200 text-gray-800",
    sold: "bg-red-200 text-red-800",
    inactive: "bg-yellow-200 text-yellow-800",
    archived: "bg-gray-400 text-white",
  };

  // HANDLE NULL SELLER INFO //
  const sellerName = listing.seller
    ? `${listing.seller.first_name ?? ""} ${listing.seller.last_name ?? ""}`.trim() || "Unknown Seller"
    : "Unknown Seller";

  const sellerPhone = formatPhoneNumber(listing.seller?.phone_number);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-5 flex flex-col gap-3 w-full max-w-md mx-auto">
      {/* OPTIONAL IMAGE */}
      {listing.image_url && (
        <img
          src={listing.image_url}
          alt={listing.title}
          className="w-full h-48 object-cover rounded-xl mb-3"
        />
      )}

      {/* TITLE & STATUS */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-950">{listing.title}</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusClasses[listing.status]
          }`}
        >
          {listing.status.toUpperCase()}
        </span>
      </div>
      
      {/* PRICE */}
      <p className="text-lg font-semibold text-gray-800">${priceDollars}</p>

      {/* SELLER INFO */}
      <div className="text-sm text-gray-700 bg-blue-50 rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
        <p>
          <span className="font-semibold text-blue-900">Seller:</span> {sellerName}
        </p>
        <p>
          <span className="font-semibold text-blue-900">Phone:</span> {sellerPhone}
        </p>
      </div>

      {/* DESCRIPTION */}
      {listing.description && (
        <div>
          <button
            className="text-sm text-blue-500 underline mb-1"
            onClick={() => setShowDescription(!showDescription)}
          >
            {showDescription ? "Hide" : "Show"} Description
          </button>
          {showDescription && (
            <p className="text-gray-700 text-sm mt-1">{listing.description}</p>
          )}
        </div>
      )}

      {/* EDIT BUTTON */}
      {onEdit && (
        <button
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={() => onEdit(listing)}
        >
          Edit
        </button>
      )}

      {/* TIMESTAMP */}
      <p className="text-xs text-gray-400 mt-2">
        Created: {new Date(listing.created_at).toLocaleString()}
      </p>
    </div>
  );
}
