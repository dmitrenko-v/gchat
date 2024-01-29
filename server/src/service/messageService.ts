import { Message, PrismaClient } from "@prisma/client";
import { prisma } from "..";
import { MessageData } from "../types";

export async function findMessagesInChatService(chatId: number): Promise<Message[]> {
  const messages = await prisma.message.findMany({
    where: {
      chatId,
    },
  });

  return messages;
}

export async function sendMessageService(data: MessageData): Promise<Message> {
  const message = await prisma.message.create({ data });
  return message;
}
