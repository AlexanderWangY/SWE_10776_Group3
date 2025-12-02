import { Link } from "@heroui/react";

{/*RENDERS THE BRAND LOGO AS A HOME LINK.*/}
export default function OurLogo() {
  return (
    // RESPONSIVE HEIGHT ENSURES THE LOGO SCALES ACROSS BREAKPOINTS. //
    <Link href="/" className="flex items-center gap-2">
      <img src="/gator-logo.png" alt="Logo" className="h-18 sm:h-20 md:h-22 lg:h-24 w-auto"/>
    </Link>
  );
}
