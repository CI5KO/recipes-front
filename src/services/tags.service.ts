"use server";

import { Tag } from "@/src/types";

export async function createTag(tag: Omit<Tag, "id">): Promise<Tag> {
  return { id: crypto.randomUUID(), ...tag };
}

export async function updateTag(id: string, tag: Partial<Tag>): Promise<Tag | null> {
  return { id, ...tag } as Tag;
}

export async function deleteTag(id: string): Promise<boolean> {
  return true;
}
