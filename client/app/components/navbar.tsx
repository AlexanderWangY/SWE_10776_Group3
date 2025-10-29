import { useState, useEffect } from "react";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import OurLogo from "../components/logo";

export const SearchIcon = ({ size = 24, strokeWidth = 1.5, width, height, ...props }) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 24 24"
    width={width || size}
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);

export default function AppNavbar() {
  const [pathname, setPathname] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Set current pathname on mount
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/auth/me`,
          { credentials: "include" }
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

  // Handle logout
  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    window.location.href = "/";
  };

  if (loading) return null; // wait for user check

  return (
    <Navbar className="w-[75%] mx-auto mt-4 px-6 py-4 bg-white/60 backdrop-blur-md shadow-lg rounded-2xl border border-white/10">
      {/* LEFT */}
      <NavbarContent justify="start">
        <NavbarBrand>
          <OurLogo />
        </NavbarBrand>
      </NavbarContent>

      {/* CENTER + RIGHT */}
      {!user ? (
        <>
          {/* Guest view */}
          <NavbarContent className="hidden sm:flex gap-8 text-lg font-medium" justify="center">
            <NavbarItem isActive={pathname === "/"}><Link href="/">Home</Link></NavbarItem>
            <NavbarItem isActive={pathname === "/about"}><Link href="/about">About Us</Link></NavbarItem>
            <NavbarItem isActive={pathname === "/listings"}><Link href="/listings">Listings</Link></NavbarItem>
          </NavbarContent>

          <NavbarContent justify="end" className="gap-4 text-lg font-medium">
            <NavbarItem isActive={pathname === "/login"}><Link href="/login">Login</Link></NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/register" variant="flat" className="text-lg px-5 py-2">
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
        </>
      ) : (
        <>
          {/* Logged-in view */}
          <NavbarContent as="div" className="items-center" justify="end">
            <Input
              classNames={{
                base: "max-w-full sm:max-w-[80rem] h-10",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal text-default-600 bg-white/70 backdrop-blur-md border border-white/40 rounded-xl shadow-sm",
              }}
              placeholder="Search listings..."
              size="sm"
              startContent={<SearchIcon size={18} />}
              type="search"
            />
          </NavbarContent>

          <NavbarContent justify="end" className="gap-6">
            <span className="text-lg font-medium">
              Hey, {user.first_name || user.email.split("@")[0]}!
            </span>

            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  src={user.profile_image || ""}
                  className="w-10 h-10 cursor-pointer"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile menu" variant="flat">
                <DropdownItem key="profile"><Link href="/profile">Profile</Link></DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={handleLogout}>Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </>
      )}
    </Navbar>
  );
}
