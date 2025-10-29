import { useState, useEffect } from "react";
import { Welcome } from "../welcome/welcome";
import ListingsPage from "./listings";
import type { Route } from "./+types/_index";
import AppNavbar from "../components/navbar";

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

  // Fade-in animation
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  // Fetch user from backend
  useEffect(() => {
    setPathname(window.location.pathname);

    const fetchUser = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const res = await fetch(`${apiUrl}/auth/me`, {
          credentials: "include",
        });

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-orange-500 to-blue-500 gap-6">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

        {/* Message */}
        <p className="text-white text-lg font-semibold drop-shadow-md">
          Loading GatorMarket...
        </p>
        <p className="text-white/80 text-sm">
          Please wait while we fetch your data
        </p>
      </div>
    );
  }


  return (
    <div
      className={`min-h-screen w-full pb-4 bg-gradient-to-tr from-orange-500 to-blue-500 flex flex-col transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <AppNavbar user={user} setUser={setUser} />

      <main className="pt-10 flex flex-col items-center w-full px-5 flex-grow">
        {!user ? <Welcome /> : <ListingsPage user={user} setUser={setUser}/>}
      </main>
    </div>
  );
}
