import { Message, Chat } from "@prisma/client";
import { Context, UserPublicData } from "../types";
import { findUserService } from "../service/userService";
import { findMessagesInChatService } from "../service/messageService";
import { getChatUsersService } from "../service/chatService";

export async function creator(parent: Chat, __: null, contextValue: Context): Promise<UserPublicData | null> {
  const { prisma } = contextValue;

  const creator = await findUserService({ id: parent.creatorId }, prisma);

  if (!creator) return null;

  const creatorPublicData = {
    id: creator.id,
    firstName: creator.firstName,
    secondName: creator.secondName,
    userName: creator.userName,
  };

  return creatorPublicData;
}

export async function messages(parent: Chat, __: null, contextValue: Context): Promise<Message[]> {
  const { prisma } = contextValue;

  const messages = findMessagesInChatService(parent.id, prisma);

  return messages;
}

export async function users(parent: Chat, __: null, contextValue: Context): Promise<UserPublicData[] | null> {
  const { prisma } = contextValue;

  const chatUsers = await getChatUsersService(parent.id, prisma);

  return chatUsers;
}
