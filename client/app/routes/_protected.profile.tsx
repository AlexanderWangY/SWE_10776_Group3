import { Link, useOutletContext } from "react-router";
import type { Route } from "./+types/_protected.profile";
import type { User } from "~/libs/auth";
import { useUser } from "./_protected";
import { Avatar } from "@heroui/react";

export default function Profile({}: Route.ComponentProps) {
  const { user } = useUser();

  const hasName = user.first_name || user.last_name;
  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <main className="min-h-screen w-full bg-neutral-100">
      <div className="max-w-4xl mx-auto pt-24 flex flex-col gap-4">
        <Avatar name={hasName ? fullName : undefined} className="h-24 w-24" />
        <div className="flex flex-col">
          <h1 className="text-3xl font-medium">
            {hasName ? fullName : "Anonymous User"}
          </h1>
          <h3 className="text-sm text-neutral-700">{user.email}</h3>

          {user.phone_number ? (
            <p className="mt-2 text-neutral-800">Phone: {user.phone_number}</p>
          ) : (
            <Link to="/profile/edit" className="mt-2 text-blue-600 underline">Add a phone number</Link>
          )}
        </div>
      </div>
    </main>
  );
}
