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
        { title: "About Gatormarket" },
        {
            name: "description",
            content: "Learn more about Gatormarket, the student marketplace built by UF students for UF students!",
        },
    ];
}

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-tr from-orange-500 to-blue-500 flex flex-col">
              <AppNavbar></AppNavbar>
         </div>
    )
}