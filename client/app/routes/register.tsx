"use client";
import { useEffect, useState } from "react";
import { Button, Card, Form, Input } from "@heroui/react";
import { Link } from "react-router";
import BackButton from "~/components/backbutton";
import Notification from "~/components/notification";
import api from "../api";

export default function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type?: "success" | "error" | "info" } | null>(null);
  const [loading, setLoading] = useState(false); // disables submit while registering

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotification(null); // clear any previous notifications
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
      setNotification({ message: "Email must be a valid @ufl.edu address.", type: "error" });
      setLoading(false);
      return;
    }

    // Validate password
    if (password !== confirmPassword) {
      setNotification({ message: "Passwords do not match!", type: "error" });
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

      // Only show success notification if backend triggered verification email
      if (res.status === 201) {
        setNotification({
          message: "✅ Account created! Check your GatorMail for the verification link.",
          type: "success",
        });
        e.currentTarget.reset();
      } else {
        setNotification({
          message: "Account created, but verification email status unknown. Check your inbox.",
          type: "info",
        });
      }
    } catch (err: any) {
      console.error("Registration error:", err.response?.data || err);
      setNotification({
        message: err.response?.data?.detail || "Registration failed. Try again.",
        type: "error",
      });
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
      {notification && <Notification message={notification.message} type={notification.type} />}
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
