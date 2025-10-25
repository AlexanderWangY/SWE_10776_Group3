import { Link } from "@heroui/react";

export default function BackButton() {
  return (
    <Link
      href="/"
      className="absolute top-6 left-10 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-2xl shadow-lg hover:bg-white/30 hover:scale-105 transition-all"
    >
      ←
    </Link>
  );
}
