import { Link } from "@heroui/react";

{/*RENDERS A FLOATING BACK BUTTON THAT ROUTES USERS TO THE HOME PAGE. 
THE BUTTON INTENTIONALLY BLENDS WITH HERO GRADIENTS USING A TRANSLUCENT PILL. */}
export default function BackButton() {
  return (
    // STYLED LINK KEEPS THE BUTTON LIGHTWEIGHT WHILE OFFERING HOVER FEEDBACK. //
    <Link
      href="/"
      className="absolute top-6 left-10 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-2xl shadow-lg hover:bg-white/30 hover:scale-105 transition-all"
    >
      ←
    </Link>
  );
}
