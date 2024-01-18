import { Context } from "../types";

export async function chats(_: any, __: null, contextValue: Context) {
  const { prisma, userId } = contextValue;
  if (!userId) {
    return;
  }
  const chats = await prisma.user.findUnique({ where: { id: userId } }).chats();
  return chats;
}
