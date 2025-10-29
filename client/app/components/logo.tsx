import { Link } from "@heroui/react";

export default function OurLogo() {
  return (
    <Link
      href="/"
      className="flex items-center justify-center h-full" // Center horizontally + vertically
    >
      <img
        src="/gator-logo.png"
        alt="Logo"
        className="h-16 sm:h-18 md:h-20 lg:h-24 w-auto object-contain" // Keep aspect ratio
      />
    </Link>
  );
}


