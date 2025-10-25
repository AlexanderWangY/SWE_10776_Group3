import { useState, useEffect } from "react";
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@heroui/react";
import OurLogo from "../components/logo";

export default function AppNavbar() {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <Navbar className="w-[75%] mx-auto mt-4 px-6 py-4 bg-white/60 backdrop-blur-md shadow-lg rounded-2xl border border-white/10" shouldHideOnScroll={false}>
      {/* LEFT */}
      <NavbarContent justify="start">
        <NavbarBrand className="flex items-left text-xl">
          <OurLogo />
        </NavbarBrand>
      </NavbarContent>

      {/* CENTER */}
      <NavbarContent className="hidden sm:flex gap-8 text-lg font-medium" justify="center">
        <NavbarItem isActive={pathname === "/"}>
          <Link href="/" className="hover:opacity-80 transition-opacity">Home</Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/about"}>
          <Link href="/about" className="hover:opacity-80 transition-opacity">About Us</Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/listings"}>
          <Link href="/listings" className="hover:opacity-80 transition-opacity">Listings</Link>
        </NavbarItem>
      </NavbarContent>

      {/* RIGHT */}
      <NavbarContent justify="end" className="gap-4 text-lg font-medium">
        <NavbarItem className="hidden lg:flex" isActive={pathname === "/login"}>
          <Link href="/login" className="hover:opacity-80 transition-opacity">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/register" variant="flat" className="text-lg px-5 py-2">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
