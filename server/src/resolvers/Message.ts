import { Message } from "@prisma/client";
import { Context, UserPublicData } from "../types";
import { findUserService } from "../service/userService";

export async function user(parent: Message, __: null, contextValue: Context): Promise<UserPublicData | null> {
  const { prisma } = contextValue;

  const user = await findUserService({ id: parent.userId }, prisma);

  if (!user) return null;

  const userDataToSend = {
    id: user.id,
    firstName: user.firstName,
    secondName: user.secondName,
    userName: user.secondName,
  };

  return userDataToSend;
}
