"use client";
import { useEffect, useState } from "react";
import { Button, Card, Form, Input } from "@heroui/react";
import { Link, useNavigate } from "react-router";
import BackButton from "~/components/backbutton";
import Notification from "~/components/notification";
import api from "../api";
import toast from "react-hot-toast";

export default function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // disables submit while registering

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const firstName = (formData.get("firstName") as string)?.trim() || null;
    const lastName = (formData.get("lastName") as string)?.trim() || null;
    const phoneNumber = (formData.get("phoneNumber") as string)?.trim() || null;

    // Validate email
    if (!email.endsWith("@ufl.edu")) {
      toast.error("Please use a valid @ufl.edu email address.");
      setLoading(false);
      return;
    }

    // Validate password
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Send registration request
      const res = await api.post("/auth/register", {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      });

      toast.success("We just sent you a verification email. Please check your inbox.", {
        duration: 10000,
      });
      navigate("/login");
    } catch (err: any) {
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", err.response?.data || err);
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
            <h1 className="text-blue-950 font-medium text-2xl mb-1">Get started</h1>
            <p className="text-blue-950">Create an account to continue</p>
          </header>

          <Form className="flex flex-col gap-3 mt-3" onSubmit={handleRegister}>
            <Input label="Email" name="email" type="email" required size="sm" radius="sm" variant="bordered" />
            <Input label="First Name" name="firstName" type="text" size="sm" radius="sm" variant="bordered" />
            <Input label="Last Name" name="lastName" type="text" size="sm" radius="sm" variant="bordered" />
            <Input label="Phone Number" name="phoneNumber" type="text" size="sm" radius="sm" variant="bordered" />
            <Input label="Password" name="password" type="password" required size="sm" radius="sm" variant="bordered" />
            <Input label="Confirm Password" name="confirmPassword" type="password" required size="sm" radius="sm" variant="bordered" />

            <Button color="primary" size="md" radius="sm" type="submit" className="mt-2" fullWidth disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Form>
        </Card>

        <footer>
          <p className="text-white text-sm text-center">
            By registering, you agree to our{" "}
            <Link to={{ pathname: "/terms" }} className="underline">Terms of Service</Link> and{" "}
            <Link to={{ pathname: "/privacy" }} className="underline">Privacy Policy</Link>.
          </p>
        </footer>

        <p className="text-white text-sm fixed bottom-4 left-1/2 -translate-x-1/2">
          Already have an account? <Link className="text-white underline" to={{ pathname: "/login" }}>Log In</Link>
        </p>
      </main>
    </div>
  );
}
