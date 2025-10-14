"use client";

import { type ReactNode } from "react";

interface IndexClientProps {
  validateToken: (token: string) => Promise<boolean>;
}

export default function IndexClient({
  validateToken,
}: IndexClientProps): ReactNode {
  return <></>;
}
