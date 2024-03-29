import { PubSub } from "graphql-subscriptions";
import { ServerResponse } from "http";

export interface Context {
  pubsub: PubSub;
  userId: number | null;
  res: ServerResponse;
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

export type UserPublicData = {
  id: number;
  userName: string;
  firstName: string;
  secondName: string;
};

export type AuthPayload = {
  token: string;
  user: UserPublicData;
};

export type ChatData = {
  name: string;
  creatorId: number;
};

export type MessageData = {
  userId: number;
  chatId: number;
  content: string;
};
