"use server";

import { cookies } from "next/headers";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(
    process.env.COOKIE_NAME || "cooking-cat",
  );

  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function setSession(session: Session) {
  const cookieStore = await cookies();
  cookieStore.set(
    process.env.COOKIE_NAME || "cooking-cat",
    JSON.stringify(session),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 365 días
    },
  );
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(process.env.COOKIE_NAME || "cooking-cat");
}

export async function generateMockSession(): Promise<Session> {
  return {
    user: {
      id: "mock-user-" + Math.random().toString(36).substring(2, 11),
      email: "usuario@empresa.com",
      name: "Usuario Demo",
    },
    accessToken:
      "mock_access_token_" + Math.random().toString(36).substring(2, 22),
    refreshToken:
      "mock_refresh_token_" + Math.random().toString(36).substring(2, 22),
  };
}
