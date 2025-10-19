import { Link } from "@heroui/react";

export default function OurLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <img src="/gator-logo.png" alt="Logo" className="h-18 sm:h-20 md:h-22 lg:h-24 w-auto"/>
    </Link>
  );
}
