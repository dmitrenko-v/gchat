import { User } from "@prisma/client";
import {
  MutationCreateChatArgs,
  Context,
  MutationRegisterArgs,
  UserData,
} from "../types";
import { GraphQLError } from "graphql";
import { validateUserData } from "../utils/validators";
import { hash } from "bcrypt";
import * as jwt from "jsonwebtoken";

export async function createChat(
  _: any,
  args: MutationCreateChatArgs,
  contextValue: Context
) {
  const { userId, prisma } = contextValue;

  const newChat = await prisma.chat.create({
    data: {
      name: args.name,
      creatorId: userId,
    },
  });

  return newChat;
}

export async function register(
  _: any,
  args: MutationRegisterArgs,
  contextValue: Context
) {
  const { prisma } = contextValue;
  const hashedPassword = await hash(args.password, 10);

  const { valid, message } = await validateUserData(args, prisma);
  if (!valid)
    throw new GraphQLError(message, {
      extensions: {
        code: "BAD_USER_INPUT",
        http: {
          status: 400,
        },
      },
    });
  await prisma.user.create({
    data: { ...args, password: hashedPassword },
  });

  const userDataToSend: UserData = {
    firstName: args.firstName,
    secondName: args.secondName,
    userName: args.userName,
  };

  return {
    token: "12345",
    user: userDataToSend,
  };
}
