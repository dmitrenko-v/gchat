import { withFilter } from "graphql-subscriptions";
import { pubsub } from "..";

export const newChat = {
  subscribe: () => pubsub.asyncIterator(["NEW_CHAT"]),
};

export const newMessageInChat = {
  subscribe: withFilter(
    () => pubsub.asyncIterator(["NEW_MESSAGE"]),
    (payload, variables) => {
      return payload.newMessageInChat.chatId === Number(variables.chatId);
    }
  ),
};
