"use server";

import { type ReactNode } from "react";

import IndexClient from "./IndexClient";
import { validateToken } from "@/src/services/index.service";

export default async function Home(): Promise<ReactNode> {
  return <IndexClient validateToken={validateToken} />;
}
