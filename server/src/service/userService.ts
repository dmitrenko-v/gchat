import { Prisma, PrismaClient } from "@prisma/client";
import { UserPublicData } from "../types";
import type { Chat, User } from "@prisma/client";
import { prisma } from "..";

export async function getUsersService(): Promise<UserPublicData[]> {
  const users = await prisma.user.findMany({
    select: { id: true, userName: true, firstName: true, secondName: true },
  });
  return users;
}

export async function createUserService(userData: Prisma.UserCreateInput): Promise<UserPublicData> {
  const user = await prisma.user.create({ data: userData });
  const userToSend = {
    id: user.id,
    firstName: user.firstName,
    secondName: user.secondName,
    userName: user.userName,
  };

  return userToSend;
}

export async function findUserService(filter: Prisma.UserWhereUniqueInput): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: filter });

  return user;
}

export async function getUserChatsService(filter: Prisma.UserWhereUniqueInput): Promise<Chat[] | null> {
  const chats = await prisma.user.findUnique({ where: filter }).chats();

  return chats;
}
