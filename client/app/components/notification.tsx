"use client";
import { useEffect, useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";

type NotificationProps = {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number; 
};

{/* RENDERS DISMISSIBLE INLINE NOTIFICATIONS WITH OPTIONAL AUTO-CLOSE. */}
export default function Notification({ message, type = "info", duration = 60000 }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timeout = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timeout);
    }
  }, [duration]);

  if (!visible) return null;

  const typeClasses = {
  success: "bg-zinc-100 text-blue-950 border-none shadow-lg rounded-2xl",
  error: "bg-zinc-100 text-blue-950 border-none shadow-lg rounded-2xl",
  info: "bg-zinc-100 text-blue-950 border-none shadow-lg rounded-2xl",
  };

  return (
    <Card
      className={`max-w-sm w-full border ${typeClasses[type]} shadow-md rounded-xl transition-all duration-500 fixed z-50`}
      style={{ top: "2rem", right: "2rem" }}
    >
      <CardBody className="p-4 text-center font-medium">{message}</CardBody>
      <Button
        onClick={() => setVisible(false)}
        className="absolute -top-0 -right-4 text-xs p-3"
        size="sm"
        color="transparent"
      >
        ✕
      </Button>
    </Card>
  );
}
