import { Message, PrismaClient } from "@prisma/client";

export async function findMessagesInChatService(chatId: number, prisma: PrismaClient): Promise<Message[]> {
  const messages = prisma.message.findMany({
    where: {
      chatId,
    },
  });

  return messages;
}
