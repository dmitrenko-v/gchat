import { MutationCreateChatArgs, Context, MutationRegisterArgs, MutationLoginArgs, AuthPayload, Chat } from "../types";
import { GraphQLError } from "graphql";
import { validateUserData } from "../utils/validators";
import { hash, compare } from "bcrypt";
import { createUser, findUser } from "../service/userService";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findChat } from "../service/chatService";
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

export async function createChat(_: any, args: MutationCreateChatArgs, contextValue: Context): Promise<Chat> {
  const { userId, prisma } = contextValue;

  if (!userId) {
    throw new GraphQLError("Unauthorized", {
      extensions: UNAUTHORIZED_ERROR,
    });
  }

  const creator = await findUser({ id: userId }, prisma);

  if (!creator) {
    throw new GraphQLError("User doesn't exist", {
      extensions: UNAUTHORIZED_ERROR,
    });
  }

  const chat = await findChat(args.name, prisma);

  if (chat) {
    throw new GraphQLError("Chat with given name already exists", { extensions: BAD_USER_INPUT_ERROR });
  }

  const newChat = await prisma.chat.create({
    data: {
      name: args.name,
      creatorId: userId,
    },
  });

  return {
    id: newChat.id,
    name: args.name,
    creatorId: userId,
  };
}

export async function register(_: any, args: MutationRegisterArgs, contextValue: Context): Promise<AuthPayload> {
  const { prisma } = contextValue;
  const hashedPassword = await hash(args.password, 10);

  const { valid, message } = await validateUserData(args, prisma);

  if (!valid)
    throw new GraphQLError(message, {
      extensions: BAD_USER_INPUT_ERROR,
    });

  const userDataToSend = await createUser({ ...args, password: hashedPassword }, prisma);

  const token = jwt.sign({ userId: userDataToSend.id }, process.env.SECRET_KEY as string, { expiresIn: "1h" });

  return {
    token: token,
    user: userDataToSend,
  };
}

export async function login(_: any, args: MutationLoginArgs, contextValue: Context): Promise<AuthPayload> {
  const { prisma } = contextValue;

  const { email, password } = args;

  const user = await findUser({ email }, prisma);

  if (!user) {
    throw new GraphQLError("User with given email not found", {
      extensions: BAD_USER_INPUT_ERROR,
    });
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    throw new GraphQLError("Invalid password", {
      extensions: BAD_USER_INPUT_ERROR,
    });
  }

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
