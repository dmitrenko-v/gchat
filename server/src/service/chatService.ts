import { PrismaClient } from "@prisma/client";
import { Chat } from "../types";

export async function findChat(name: string, prisma: PrismaClient): Promise<Chat | null> {
  const chat = prisma.chat.findUnique({
    where: {
      name,
    },
  });
  return chat;
}

export async function createChat(name: string, prisma: PrismaClient) {}
