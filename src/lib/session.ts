import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "secret-key";

export function signSession(data: string): string {
  const timestamp = Date.now();
  const payload = `${data}|${timestamp}`;
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(payload);
  return `${payload}.${hmac.digest("hex")}`;
}
