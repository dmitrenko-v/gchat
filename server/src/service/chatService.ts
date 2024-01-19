import { PrismaClient, Prisma, Chat } from "@prisma/client";
import { ChatData, UserPublicData } from "../types";

export async function getChatsService(prisma: PrismaClient): Promise<Chat[]> {
  const chats = prisma.chat.findMany({});
  return chats;
}

export async function findChatService(filter: Prisma.ChatWhereUniqueInput, prisma: PrismaClient): Promise<Chat | null> {
  const chat = prisma.chat.findUnique({
    where: filter,
  });
  return chat;
}

export async function createChatService(chatData: ChatData, prisma: PrismaClient): Promise<Chat> {
  const chat = prisma.chat.create({
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

export async function getChatUsersService(id: number, prisma: PrismaClient): Promise<UserPublicData[] | null> {
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
