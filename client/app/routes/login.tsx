"use client";
import { useEffect, useState } from "react";
import { Button, Card, Form, Input } from "@heroui/react";
import { Link, useNavigate } from "react-router";
import BackButton from "~/components/backbutton";
import api from "../api";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    try {
      const res = await api.post(
        "/auth/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );

      if (res.status === 204) {
        navigate("/listings");
      } else {
        setError("Login successful but unable to redirect. Try refreshing.");
      }
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-tr from-orange-500 to-blue-500 flex items-center justify-center transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <main className="max-w-sm w-full px-4 flex flex-col gap-6">
        <BackButton />
        <Card className="p-6 shadow-lg bg-zinc-100 rounded-2xl animate-fadefloat">
          <header>
            <h1 className="text-blue-950 font-medium text-2xl mb-1">Welcome Back</h1>
            <p className="text-blue-950">Login to continue to GatorMarket</p>
          </header>

          <Form className="flex flex-col gap-3 mt-3" onSubmit={handleLogin}>
            <Input
              label="Email"
              name="email"
              type="email"
              required
              size="sm"
              radius="sm"
              variant="bordered"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              required
              size="sm"
              radius="sm"
              variant="bordered"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              color="primary"
              size="md"
              radius="sm"
              type="submit"
              className="mt-2"
              fullWidth
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </Form>
        </Card>

        <p className="text-white text-sm fixed bottom-4 left-1/2 -translate-x-1/2">
          Don't have an account? <Link className="text-white underline" to="/register">Register</Link>
        </p>
      </main>
    </div>
  );
}
