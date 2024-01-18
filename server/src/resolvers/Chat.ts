import { Message } from "@prisma/client";
import { Context, Chat, UserPublicData } from "../types";

export async function creator(parent: Chat, __: null, contextValue: Context): Promise<UserPublicData> {
  const { prisma } = contextValue;

  const creator = prisma.user.findUnique({
    where: {
      id: parent.creatorId,
    },
    select: {
      firstName: true,
      secondName: true,
      userName: true,
      id: true,
    },
  });

  return creator;
}

export async function messages(parent: Chat, __: null, contextValue: Context): Promise<Message[]> {
  const { prisma } = contextValue;

  const messages = prisma.message.findMany({
    where: {
      chatId: parent.id,
    },
  });

  return messages;
}
