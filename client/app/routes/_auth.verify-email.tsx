"use client";
import { useEffect, useMemo, useState } from "react";
import { Button, Card } from "@heroui/react";
import { useNavigate, useSearchParams } from "react-router";
import BackButton from "~/components/backbutton";
import toast from "react-hot-toast";
import api from "../api";

export default function VerifyEmail() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const verificationToken = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);
  const missingToken = verificationToken.length === 0;

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleVerify = async () => {
    if (missingToken) {
      toast.error("Verification token is missing.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await api.post("/auth/verify-email", { token: verificationToken });
      navigate("/login?verified=True", { replace: true });
    } catch (err: any) {
      const message = err?.response?.data?.detail ?? "Verification failed. Please try again.";
      setErrorMessage(message);
      toast.error(message);
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
            <h1 className="text-blue-950 font-medium text-2xl mb-1 text-center">Verify your email</h1>
            <p className="text-blue-950 text-center">
              {missingToken
                ? "We could not find a verification token. Please request a new verification email."
                : "Click the button below to verify your GatorMarket account."}
            </p>
          </header>

          <Button
            color="primary"
            size="md"
            radius="sm"
            onPress={handleVerify}
            className="mt-4"
            fullWidth
            disabled={missingToken || loading}
          >
            {loading ? "Verifying..." : "Click to verify"}
          </Button>

          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        </Card>
      </main>
    </div>
  );
}
