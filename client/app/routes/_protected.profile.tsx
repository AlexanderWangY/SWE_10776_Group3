import { Link } from "react-router";
import type { Route } from "./+types/_protected.profile";
import { useUser } from "./_protected";
import { Avatar } from "@heroui/react";

const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, "");

  // Limit to max 10 digits
  const digits = cleaned.slice(0, 10);

  // Format based on length
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function Profile({}: Route.ComponentProps) {
  const { user } = useUser();

  const hasName = user.first_name || user.last_name;
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  return (
    <main className="min-h-screen w-full bg-neutral-100">
      <div className="max-w-4xl mx-auto pt-24 flex flex-col gap-4 px-6">
        <Avatar
          name={hasName ? fullName : undefined}
          src={user.profile_picture_url || "/GatorAvatarTemporary.png"}
          className="h-24 w-24"
        />
        <div className="flex flex-col gap-1">
          {/* Name + Edit */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">
              {hasName ? fullName : "Anonymous User"}
            </h1>
            <Link
              to="/profile/edit"
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Edit
            </Link>
          </div>
          <p className="text-neutral-600 text-sm">{user.email}</p>
          {user.phone_number ? (
            <p className="text-neutral-600 text-sm">
              {formatPhoneNumber(user.phone_number)}
            </p>
          ) : (
            <Link
              to="/profile/edit"
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Add a phone number
            </Link>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-2">
          <h2 className="text-2xl font-medium">My Listings</h2>
          <p className="text-neutral-700 text-sm">You have no listings yet.</p>
        </div>
      </div>
    </main>
  );
}
