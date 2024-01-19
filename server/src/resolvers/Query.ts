import { Context, QueryChatArgs, QueryUserArgs, UserPublicData } from "../types";
import { findUserService, getUsersSerice } from "../service/userService";
import { Chat, User } from "@prisma/client";
import { findChatService, getChatsService } from "../service/chatService";

export async function users(_: any, __: null, contextValue: Context): Promise<UserPublicData[]> {
  const { prisma } = contextValue;
  const users = await getUsersSerice(prisma);
  return users;
}

export async function chats(_: any, __: null, contextValue: Context): Promise<Chat[]> {
  const { prisma } = contextValue;
  const chats = await getChatsService(prisma);
  return chats;
}

export async function user(_: any, args: QueryUserArgs, contextValue: Context): Promise<User | null> {
  const id = Number(args.userId);
  const { prisma } = contextValue;

  const user = findUserService({ id }, prisma);

  return user;
}

export async function chat(_: any, args: QueryChatArgs, contextValue: Context): Promise<Chat | null> {
  const id = Number(args.chatId);
  const { prisma } = contextValue;

  const chat = findChatService({ id }, prisma);

  return chat;
}
