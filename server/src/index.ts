import { Context } from "./types";
import { readFileSync } from "fs";
import { join } from "path";
import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { startStandaloneServer } from "@apollo/server/standalone";

import * as Mutation from "./resolvers/Mutation";
import * as Query from "./resolvers/Query";
import * as User from "./resolvers/User";
import * as Chat from "./resolvers/Chat";
import { getUserId } from "./utils/parseToken";

const resolvers = { Mutation, Query, User, Chat };
const typeDefs = readFileSync(join(__dirname, "schema.graphql"), {
  encoding: "utf-8",
});

const prisma = new PrismaClient();

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

(async () => {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => {
      const userId = req && req.headers.authorization ? getUserId(req.headers.authorization) : null;
      return {
        prisma: prisma,
        userId,
        res,
      };
    },
  });
  console.log(`🚀  Server ready at: ${url}`);
})();
