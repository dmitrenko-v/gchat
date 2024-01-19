import { Prisma, PrismaClient } from "@prisma/client";
import { UserPublicData } from "../types";
import type { User } from "@prisma/client";

export async function getUsersSerice(prisma: PrismaClient): Promise<UserPublicData[]> {
  const users = prisma.user.findMany({ select: { id: true, userName: true, firstName: true, secondName: true } });
  return users;
}

export async function createUserService(
  userData: Prisma.UserCreateInput,
  prisma: PrismaClient
): Promise<UserPublicData> {
  const user = await prisma.user.create({ data: userData });

  const userToSend = {
    id: user.id,
    firstName: user.firstName,
    secondName: user.secondName,
    userName: user.userName,
  };

  return userToSend;
}

export async function findUserService(filter: Prisma.UserWhereUniqueInput, prisma: PrismaClient): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: filter });

  return user;
}
