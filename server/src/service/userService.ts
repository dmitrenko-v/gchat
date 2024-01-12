import { PrismaClient } from "@prisma/client";
import { MutationRegisterArgs, UserFilter } from "../types";

export async function getUsers(prisma: PrismaClient) {
  const users = prisma.user.findMany({ select: { id: true, userName: true, firstName: true, secondName: true } });
  return users;
}

export async function createUser(userData: MutationRegisterArgs, prisma: PrismaClient) {
  const user = await prisma.user.create({ data: userData });

  const userToSend = {
    id: user.id,
    firstName: user.firstName,
    secondName: user.secondName,
    userName: user.userName,
  };

  return userToSend;
}

export async function findUser(filter: UserFilter, prisma: PrismaClient) {
  const user = await prisma.user.findUnique({ where: filter });

  return user;
}
