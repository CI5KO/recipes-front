"use server";

export async function validateToken(token: string): Promise<boolean> {
  return token === (process.env.SECRET_TOKEN || "");
}
