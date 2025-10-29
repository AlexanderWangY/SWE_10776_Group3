"use client";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { useEffect, useState } from "react";
import AppNavbar from "../components/navbar";

export default function Profile() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-tr from-orange-500 to-blue-500 flex flex-col transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
    <Card className="min-h-screen w-sm flex center">

    </Card>
    </div>
  );
}
