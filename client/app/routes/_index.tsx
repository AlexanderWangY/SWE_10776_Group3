import { Button, Navbar,
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Link } from "@heroui/react";
import { Welcome } from "../welcome/welcome";
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
  return (
    <main className="min-h-screen bg-gradient-to-tr from-orange-500 to-blue-500 flex flex-col">
      <div>
      <AppNavbar></AppNavbar>
      </div>
      <div className=" pb-5 pt-10 pl-25 pr-25 flex-grow">
      <Welcome></Welcome>
      </div>
    </main>
  );
}
