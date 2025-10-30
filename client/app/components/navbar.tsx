import { useState, useEffect } from "react";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownTrigger,
  Dropdown,
  Avatar,
  DropdownMenu,
  DropdownItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";
import OurLogo from "../components/logo";
import { useLocation, useNavigate } from "react-router";
import { auth, type User } from "~/libs/auth";

interface MenuItem {
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "Listings",
    href: "/listings",
  },
];

interface Props {
  user: User | null;
}

export default function AppNavbar({ user }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, _] = useState(false);

  const handleLogout = async () => {
    await auth.logout();
    navigate("/login");
  }

  return (
    <Navbar className="border-b-1 border-neutral-200" maxWidth="xl" shouldHideOnScroll={false} position="static">
      {/* LEFT */}
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
        <NavbarBrand className="flex items-left text-xl text-blue-600 font-bold">
          GatorMarket
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden md:flex gap-8 text-lg font-medium"
        justify="center"
      >
        {menuItems.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <Link
              href={item.href}
              color={pathname === item.href ? "primary" : "foreground"}
              className="hover:opacity-80 transition-opacity"
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              className="w-full"
              color={pathname === item.href ? "primary" : "foreground"}
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      {/* RIGHT */}
      <NavbarContent justify="end">
        {user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                className="transition-transform cursor-pointer"
                color="primary"
                disableAnimation
                name={
                  `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
                }
                size="sm"
                src={user.profile_picture_url || "https://i.pravatar.cc/150?u=default"}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2" disableAnimation>
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="settings" href="/profile">My Profile</DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem>
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/register" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
