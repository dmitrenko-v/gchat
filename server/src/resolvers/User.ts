import { Chat } from "@prisma/client";
import { getUserChatsService } from "../service/userService";
import { Context, UserPublicData } from "../types";

export async function chats(parent: UserPublicData, __: null, contextValue: Context): Promise<Chat[] | null> {
  const chats = await getUserChatsService({ id: parent.id });
  return chats;
}
