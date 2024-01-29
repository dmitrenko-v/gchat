import { Context, QueryChatArgs, QueryUserArgs, UserPublicData } from "../types";
import { getUsersService, findUserService } from "../service/userService";
import { Chat, User } from "@prisma/client";
import { findChatService, getChatsService } from "../service/chatService";

export async function users(_: any, __: null, contextValue: Context): Promise<UserPublicData[]> {
  const users = await getUsersService();
  return users;
}

export async function chats(_: any, __: null, contextValue: Context): Promise<Chat[]> {
  const chats = await getChatsService();
  return chats;
}

export async function user(_: any, args: QueryUserArgs, contextValue: Context): Promise<User | null> {
  const id = Number(args.userId);

  const user = await findUserService({ id });

  return user;
}

export async function chat(_: any, args: QueryChatArgs, contextValue: Context): Promise<Chat | null> {
  const id = Number(args.chatId);
  const chat = await findChatService({ id });

  return chat;
}
