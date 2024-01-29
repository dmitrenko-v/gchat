import {
  MutationCreateChatArgs,
  Context,
  MutationRegisterArgs,
  MutationLoginArgs,
  AuthPayload,
  MutationSendMessageArgs,
} from "../types";
import { Chat } from "@prisma/client";
import { GraphQLError } from "graphql";
import { validateUserData } from "../utils/validators";
import { hash, compare } from "bcrypt";
import { findUserService, createUserService } from "../service/userService";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findChatService, createChatService } from "../service/chatService";
import { sendMessageService } from "../service/messageService";
dotenv.config();

const BAD_USER_INPUT_ERROR = {
  code: "BAD_USER_INPUT",
  http: {
    status: 400,
  },
};

const UNAUTHORIZED_ERROR = {
  code: "UNAUTHORIZED",
  http: {
    status: 405,
  },
};

const NOT_FOUND_ERROR = {
  code: "NOT FOUND",
  http: { status: 404 },
};

export async function createChat(_: any, args: MutationCreateChatArgs, contextValue: Context): Promise<Chat> {
  const { userId, pubsub } = contextValue;

  if (!userId) throw new GraphQLError("Unauthorized", { extensions: UNAUTHORIZED_ERROR });

  const creator = await findUserService({ id: userId });

  if (!creator) throw new GraphQLError("User doesn't exist", { extensions: UNAUTHORIZED_ERROR });

  const chat = await findChatService({ name: args.name });

  if (chat) throw new GraphQLError("Chat with given name already exists", { extensions: BAD_USER_INPUT_ERROR });

  const newChat = await createChatService({
    name: args.name,
    creatorId: userId,
  });

  pubsub.publish("NEW_CHAT", { newChat });

  return {
    id: newChat.id,
    name: newChat.name,
    creatorId: newChat.creatorId,
  };
}

export async function register(_: any, args: MutationRegisterArgs, contextValue: Context): Promise<AuthPayload> {
  const hashedPassword = await hash(args.password, 10);

  const { valid, message } = await validateUserData(args);

  if (!valid) throw new GraphQLError(message, { extensions: BAD_USER_INPUT_ERROR });

  const userDataToSend = await createUserService({ ...args, password: hashedPassword });

  const token = jwt.sign({ userId: userDataToSend.id }, process.env.SECRET_KEY as string, { expiresIn: "1h" });

  return {
    token: token,
    user: userDataToSend,
  };
}

export async function login(_: any, args: MutationLoginArgs, contextValue: Context): Promise<AuthPayload> {
  const { email, password } = args;

  const user = await findUserService({ email });

  if (!user) throw new GraphQLError("User with given email not found", { extensions: BAD_USER_INPUT_ERROR });

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) throw new GraphQLError("Invalid password", { extensions: BAD_USER_INPUT_ERROR });

  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY as string, { expiresIn: "1h" });

  const userDataToSend = {
    id: user.id,
    firstName: user.firstName,
    secondName: user.secondName,
    userName: user.userName,
  };

  return {
    token: token,
    user: userDataToSend,
  };
}

export async function sendMessage(_: any, args: MutationSendMessageArgs, contextValue: Context) {
  const { userId, pubsub } = contextValue;

  if (!userId) {
    throw new GraphQLError("Unauthorized", {
      extensions: UNAUTHORIZED_ERROR,
    });
  }

  const { content } = args;

  const chatId = Number(args.chatId);
  const chat = await findChatService({ id: chatId });

  if (!chat) throw new GraphQLError("Chat not found", { extensions: NOT_FOUND_ERROR });

  if (!content) throw new GraphQLError("Message can not be empty", { extensions: BAD_USER_INPUT_ERROR });

  const message = await sendMessageService({ content, userId, chatId });

  pubsub.publish("NEW_MESSAGE", { newMessageInChat: message });

  return message;
}
