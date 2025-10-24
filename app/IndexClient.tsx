"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { montserrat } from "@/src/fonts/Montserrat";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import { PiCookie } from "react-icons/pi";

interface IndexClientProps {
  validateToken: (token: string) => Promise<boolean>;
}

export default function IndexClient({
  validateToken,
}: IndexClientProps): ReactNode {
  const router = useRouter();
  const [token, setToken] = useState<string>("");

  const handleTokenChange = async (value: string) => {
    setToken(value);
    const isValid: boolean = await validateToken(value);
    if (isValid) router.push("/home");
  };

  return (
    <main
      style={montserrat.style}
      className="grid items-center justify-items-center container mx-auto h-screen max-w-4xl"
    >
      <div className="flex flex-row gap-4 w-1/3">
        <Input
          type="password"
          placeholder="Password"
          value={token}
          onChange={(value) => setToken(value)}
        />
        <Button onClick={() => handleTokenChange(token)}>
          <PiCookie />
        </Button>
      </div>
    </main>
  );
}
