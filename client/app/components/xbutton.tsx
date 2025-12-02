import { Link } from "@heroui/react";

{/*RENDERS A FLOATING CTA THAT DIRECTS USERS TO THE REGISTRATION FLOW.*/}
export default function XButton() {
  return (
    // FLOATING POSITION MIMICS A MODAL DISMISS/CTA ACTION. //
    <Link
      href="/register"
      className="absolute top-6 right-20 flex items-center justify-center w-12 h-12 rounded-full bg-black/20 backdrop-blur-md text-white font-bold text-2xl shadow-lg hover:bg-black/30 hover:scale-105 transition-all"
    >
      X
    </Link>
  );
}
