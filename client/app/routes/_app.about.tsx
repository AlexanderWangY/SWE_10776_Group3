"use client";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { useEffect, useState } from "react";
import AppNavbar from "../components/navbar";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  // IF WE WANT WE CAN ADD A BLURB ABT US BUT EHH WE REALLY DONT NEED IT
  const developers = [
    {
      name: "Alexander Wang",
      role: "Frontend Developer",
      img: "/public/alex.jpg",
    },
    {
      name: "Evelyn Colon",
      role: "Project Manager",
      img: "/public/evelyn.jpg",
    },
    {
      name: "Kali Schuchhardt",
      role: "Frontend Developer",
      img: "/public/kali.jpg",
    },
    {
      name: "Anders Swenson",
      role: "Backend Developer",
      img: "/public/anders.jpg",
    },
  ];

  return (
    <div
      className={`min-h-screen w-full flex flex-col transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <main className="flex flex-col items-center w-full mt-10 px-5 flex-grow">
        <Card
          className={`max-w-4xl w-full shadow-2xl shadow-blue-950/50 bg-gradient-to-tr from-zinc-50/80 to-zinc-200/80 
                     rounded-2xl p-8 backdrop-blur-md ${isVisible ? "animate-fadeup" : ""}`}
        >
          <CardHeader className="flex flex-col items-center pb-6">
            <h1 className="text-blue-950 font-bold text-5xl text-center">
              About Us!
            </h1>
            <p className="text-gray-700 mt-4 text-center max-w-lg">
              Meet the developers behind this project:
            </p>
          </CardHeader>

          <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-0">
            {developers.map((dev, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-white/60 rounded-xl shadow-lg p-6 hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={dev.img}
                  alt={dev.name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-blue-950 shadow-md mb-4"
                />
                <h2 className="text-blue-900 font-semibold text-xl">{dev.name}</h2>
                <h3 className="text-blue-700 font-medium text-md">{dev.role}</h3>
              </div>
            ))}
          </CardBody>

          <CardFooter className="flex flex-col items-center gap-2 mt-6">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} SYLA. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
