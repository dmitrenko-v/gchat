import { Context } from "../types";

export async function chats(_: any, __: null, contextValue: Context) {
  const { prisma, userId } = contextValue;
  const chats = await prisma.user.findUnique({ where: { id: userId } }).chats();
  return chats;
}
