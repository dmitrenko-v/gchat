import { PrismaClient, Prisma, Chat } from "@prisma/client";
import { ChatData, UserPublicData } from "../types";
import { prisma } from "..";

export async function getChatsService(): Promise<Chat[]> {
  const chats = await prisma.chat.findMany({});
  return chats;
}

export async function findChatService(filter: Prisma.ChatWhereUniqueInput): Promise<Chat | null> {
  const chat = await prisma.chat.findUnique({
    where: filter,
  });
  return chat;
}

export async function createChatService(chatData: ChatData): Promise<Chat> {
  const chat = await prisma.chat.create({
    data: {
      ...chatData,
      users: {
        connect: {
          id: chatData.creatorId,
        },
      },
    },
  });

  return chat;
}

export async function getChatUsersService(id: number): Promise<UserPublicData[] | null> {
  const usersQueryResult = await prisma.chat.findUnique({
    where: {
      id,
    },
    select: {
      users: {
        select: { id: true, firstName: true, secondName: true, userName: true },
      },
    },
  });

  if (!usersQueryResult) return null;

  const { users } = usersQueryResult;

  return users;
}
