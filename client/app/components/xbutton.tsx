import { Link } from "@heroui/react";

export default function XButton() {
  return (
    <Link
      href="/register"
      className="absolute top-6 right-20 flex items-center justify-center w-12 h-12 rounded-full bg-black/20 backdrop-blur-md text-white font-bold text-2xl shadow-lg hover:bg-black/30 hover:scale-105 transition-all"
    >
      X
    </Link>
  );
}
