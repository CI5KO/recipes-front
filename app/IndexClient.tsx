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

  const handleSubmit = async () => {
    const isValid: boolean = await validateToken(token);
    if (isValid) router.push("/home");
    else setShowNotification(true);
  };

  return (
    <main
      style={montserrat.style}
      className="grid items-center justify-items-center container mx-auto h-screen max-w-4xl text-stone-800 dark:text-stone-200"
    >
      <Notification
        message="Invalid token. Please try again."
        type="error"
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
      />
      <form
        action={handleSubmit}
        className="flex flex-row items-center gap-2 w-3/4 md:w-1/2"
      >
        <div className="w-2/3 md:w-3/4">
          <Input
            type="password"
            placeholder="Password"
            value={token}
            onChange={(value) => setToken(value)}
          />
        </div>
        <Button type="submit">
          <PiCookie />
        </Button>
        <ThemeSwitcher />
      </form>
    </main>
  );
}
