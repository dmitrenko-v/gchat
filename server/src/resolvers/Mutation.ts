import { MutationCreateChatArgs, Context, MutationRegisterArgs, MutationLoginArgs } from "../types";
import { GraphQLError } from "graphql";
import { validateUserData } from "../utils/validators";
import { hash, compare } from "bcrypt";
import { createUser, findUser } from "../service/userService";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const badUserInputErrorr = {
  code: "BAD_USER_INPUT",
  http: {
    status: 400,
  },
};

export async function createChat(_: any, args: MutationCreateChatArgs, contextValue: Context) {
  const { userId, prisma } = contextValue;

  const newChat = await prisma.chat.create({
    data: {
      name: args.name,
      creatorId: userId,
    },
  });

  return newChat;
}

export async function register(_: any, args: MutationRegisterArgs, contextValue: Context) {
  const { prisma } = contextValue;
  const hashedPassword = await hash(args.password, 10);

  const { valid, message } = await validateUserData(args, prisma);

  if (!valid)
    throw new GraphQLError(message, {
      extensions: badUserInputErrorr,
    });

  const userDataToSend = await createUser({ ...args, password: hashedPassword }, prisma);

  const token = jwt.sign({ userId: userDataToSend.id }, process.env.SECRET_KEY as string, { expiresIn: "1h" });

  return {
    token: token,
    user: userDataToSend,
  };
}

export async function login(_: any, args: MutationLoginArgs, contextValue: Context) {
  const { prisma } = contextValue;

  const { email, password } = args;

  const user = await findUser({ email }, prisma);

  if (!user) {
    throw new GraphQLError("User with given email not found", {
      extensions: badUserInputErrorr,
    });
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    throw new GraphQLError("Invalid password", {
      extensions: badUserInputErrorr,
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
