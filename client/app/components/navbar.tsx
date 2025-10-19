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
        <NavbarBrand className="flex items-left">
          <OurLogo />
        </NavbarBrand>
      </NavbarContent>

      {/* CENTER */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem isActive={pathname === "/"}>
          <Link href="/">Home</Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/about"}>
          <Link href="/about">About</Link>
        </NavbarItem>
      </NavbarContent>

      {/* RIGHT */}
      <NavbarContent justify="end" className="gap-4">
        <NavbarItem className="hidden lg:flex" isActive={pathname === "/login"}>
          <Link href="/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/register" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
