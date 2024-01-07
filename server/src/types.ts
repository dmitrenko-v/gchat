import { PrismaClient } from "@prisma/client";

export interface Context {
  prisma: PrismaClient;
  userId: number;
}

export type QueryUserArgs = {
  userId: string;
};

export type QueryChatArgs = {
  chatId: string;
};

export type SubscriptionNewMessageArgs = {
  chatId: string;
};

export type MutationSendMessageArgs = {
  chatId: string;
  content: string;
};

export type MutationRegisterArgs = {
  firstName: string;
  secondName: string;
  userName: string;
  email: string;
  password: string;
};

export type MutationLoginArgs = {
  email: string;
  password: string;
};

export type MutationCreateChatArgs = {
  name: string;
};

export type UserData = {
  firstName: string;
  secondName: string;
  userName: string;
};
