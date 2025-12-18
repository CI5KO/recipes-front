"use server";

import { setSession, generateMockSession } from "@/src/lib/auth";

export async function validateToken(token: string): Promise<boolean> {
  const isValid = token === (process.env.SECRET_TOKEN || "");
  
  if (isValid) {
    const session = await generateMockSession();
    await setSession(session);
  }
  
  return isValid;
}
