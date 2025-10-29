import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@heroui/react";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/_index";
import AppNavbar from "../components/navbar";
import { useState, useEffect } from "react";
import ListingsPage from "./listings";

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
  const [pathname, setPathname] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // FETCH THE CURRENT USER (FastAPI /auth/me)
  useEffect(() => {
    setPathname(window.location.pathname);

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/auth/me`,
          {
            credentials: "include", // cookie
          }
        );

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div
      className={`min-h-screen w-full pb-4 bg-gradient-to-tr from-orange-500 to-blue-500 flex flex-col transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >

      <main className="flex flex-col items-center w-full px-5 flex-grow">
        {!user ? (
          <Welcome />
        ) : (
          <>
            {/* logged-in view */}
            <ListingsPage/>
          </>
        )}
      </main>
    </div>
  );
}
