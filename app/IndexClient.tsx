"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { montserrat } from "@/src/fonts/Montserrat";
import Input from "@/src/components/atoms/Input";
import Button from "@/src/components/atoms/Button";
import { PiCookie } from "react-icons/pi";
import Notification from "@/src/components/atoms/Notification";
import ThemeSwitcher from "@/src/components/molecules/ThemeSwitcher";

interface IndexClientProps {
  validateToken: (token: string) => Promise<boolean>;
}

export default function IndexClient({
  validateToken,
}: IndexClientProps): ReactNode {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const handleTokenChange = async (value: string) => {
    setToken(value);
    const isValid: boolean = await validateToken(value);
    if (isValid) router.push("/home");
    else setShowNotification(true);
  };

  return (
    <main
      style={montserrat.style}
      className="grid items-center justify-items-center container mx-auto h-screen max-w-4xl"
    >
      <Notification
        message="Invalid token. Please try again."
        type="error"
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleTokenChange(token);
        }}
        className="flex flex-row items-center gap-2 w-3/4 md:w-1/2"
      >
        <Input
          type="password"
          placeholder="Password"
          value={token}
          onChange={(value) => setToken(value)}
        />
        <Button onClick={() => handleTokenChange(token)}>
          <PiCookie />
        </Button>
        <ThemeSwitcher />
      </form>
    </main>
  );
}
