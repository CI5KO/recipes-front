"use server";

import { validateToken as validateTokenService } from "@/src/services/index.service";

export async function validateTokenAction(token: string): Promise<boolean> {
  return validateTokenService(token);
}
