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
  Badge,
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
        <NavbarBrand className="flex items-left">
        <Link href="/" className="cursor-pointer">
          <span className="text-xl font-bold text-blue-600">
            GatorMarket
          </span>
        </Link>
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
            {user.is_superuser ? (
              <Badge 
                color="primary" 
                content="ADMIN" 
                size="sm" 
                placement="bottom-right" 
                classNames={{
                  badge: "text-[8px] px-0.5 h-3.5 min-w-[32px] translate-y-2.5"
                }}
              >
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
                    src={user.profile_picture_url || "/GatorAvatarTemporary.png"}
                  />
                </DropdownTrigger>
              </Badge>
            ) : (
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
                  src={user.profile_picture_url || "/GatorAvatarTemporary.png"}
                />
              </DropdownTrigger>
            )}
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2" disableAnimation>
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.email}</p>
              </DropdownItem>
              {user.is_superuser ? (
                <DropdownItem key="admin" href="/admin">Admin Dashboard</DropdownItem>
              ) : null}
              <DropdownItem key="settings" href="/profile">My Profile</DropdownItem>
              {!user.is_superuser ?(
                <DropdownItem key="report-user" href="https://docs.google.com/forms/d/e/1FAIpQLSfOMKpBLSYqOFEiFsC8QhY4kMuPH64YhwwSQZotHlOYwwyidQ/viewform?usp=header">Report A User</DropdownItem>
              ): null}
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
