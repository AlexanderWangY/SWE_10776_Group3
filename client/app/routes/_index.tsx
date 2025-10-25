import { Button, Navbar,
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Link } from "@heroui/react";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/_index";
import AppNavbar from "../components/navbar";
import { useState, useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gatormarket" },
    {
      name: "description",
      content:
        "Gatormarket is the student marketplace built by UF students for UF students!",
    },
  ];
}

export default function Root() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`min-h-screen w-full pb-4 bg-gradient-to-tr from-orange-500 to-blue-500 flex flex-col transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <AppNavbar />

      <main className="flex flex-col items-center w-full mt-10 px-5 flex-grow">
        <Welcome />
      </main>
    </div>
  );
}
