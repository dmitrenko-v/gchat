import { Message, Chat } from "@prisma/client";
import { Context, UserPublicData } from "../types";
import { findUserService } from "../service/userService";
import { findMessagesInChatService } from "../service/messageService";
import { getChatUsersService } from "../service/chatService";

export async function creator(parent: Chat, __: null, contextValue: Context): Promise<UserPublicData | null> {
  const creator = await findUserService({ id: parent.creatorId });

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
  const messages = await findMessagesInChatService(parent.id);

  return messages;
}

export async function users(parent: Chat, __: null, contextValue: Context): Promise<UserPublicData[] | null> {
  const chatUsers = await getChatUsersService(parent.id);

  return chatUsers;
}
