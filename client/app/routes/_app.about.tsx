"use client";
import { Card, CardHeader, CardBody, CardFooter, Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

{/* ABOUT PAGE WITH DEVELOPER PROFILES AND LINKS. */}
interface Developer {
  name: string;
  role: string;
  link: string;
  img: string;
}

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  {/* VISIBILITY EFFECT FOR FADE-IN ANIMATION */}
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  {/* IF WE WANT WE CAN ADD A BLURB ABT US BUT EHH WE REALLY DONT NEED IT */}
  const developers = [
    {
      name: "Evelyn Colon",
      role: "Project Manager",
      img: "/public/evelyn.jpg",
      link: "https://www.linkedin.com/in/evelyn-colon-0074a8279/",
    },
    {
      name: "Alexander Wang",
      role: "Frontend Developer",
      img: "/public/alex.jpg",
      link: "https://www.linkedin.com/in/alexanderwangy/"
    },
    {
      name: "Kali Schuchhardt",
      role: "Frontend Developer",
      img: "/public/kali.jpg",
      link: "https://www.linkedin.com/in/kalischuchhardt984/",
    },
    {
      name: "Anders Swenson",
      role: "Backend Developer",
      img: "/public/anders.jpg",
      link: "https://www.linkedin.com/in/anders-swenson/",
    },
  ];
  const [developerImages, setDeveloperImages] = useState<Record<string, string> | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadDeveloperImages = async () => {
      try {
        const apiURL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiURL}/about`);

        if (!response.ok) {
          throw new Error(`Failed to load team images (status ${response.status}).`);
        }

        const data = (await response.json()) as Record<string, string>;
        if (isMounted) {
          setDeveloperImages(data);
        }
      } catch (error: any) {
        if (isMounted) {
          setFetchError(error?.message || "Unable to fetch team images.");
        }
      }
    };

    loadDeveloperImages();
    return () => {
      isMounted = false;
    };
  }, []);

  const developers = useMemo<Developer[]>(() => (
    [
      {
        name: "Evelyn Colon",
        role: "Project Manager",
        img: developerImages?.Evelyn ?? "/public/evelyn.jpg",
        link: "https://www.linkedin.com/in/evelyn-colon-0074a8279/",
      },
      {
        name: "Alexander Wang",
        role: "Full Stack Developer",
        img: developerImages?.Alex ?? "/public/alex.jpg",
        link: "https://www.linkedin.com/in/alexanderwangy/",
      },
      {
        name: "Kali Schuchhardt",
        role: "Frontend Developer",
        img: developerImages?.Kali ?? "/public/kali.jpg",
        link: "https://www.linkedin.com/in/kalischuchhardt984/",
      },
      {
        name: "Anders Swenson",
        role: "Backend Developer",
        img: developerImages?.Anders ?? "/public/anders.jpg",
        link: "https://www.linkedin.com/in/anders-swenson/",
      },
    ]
  ), [developerImages]);

  {/* RENDER ABOUT PAGE */}
  return (
    <div
      className={`min-h-screen w-full flex flex-col transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* MAIN CONTENT */}
      <main className="flex flex-col items-center w-full px-5 flex-grow py-10 gap-6">
        <Breadcrumbs className="w-full max-w-4xl text-sm text-default-400">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem>About</BreadcrumbItem>
        </Breadcrumbs>
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

          {/* DEVELOPER PROFILES */}
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-0">
            {developers.map((dev, index) => (
              <Link to={dev.link} target="_blank" rel="noopener noreferrer" key={index}>
              <div
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
              </Link>
            ))}
          </CardBody>
          {/* FOOTER */}
          <CardFooter className="flex flex-col items-center gap-2 mt-6">
            {fetchError && (
              <p className="text-xs text-red-500">{fetchError}</p>
            )}
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} SYLA. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
