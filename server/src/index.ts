import { Context } from "./types";
import { readFileSync } from "fs";
import { join } from "path";
import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { startStandaloneServer } from "@apollo/server/standalone";

import * as Mutation from "./resolvers/Mutation";

const resolvers = { Mutation };
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
      return {
        prisma: prisma,
        userId: 5,
        res,
      };
    },
  });
  console.log(`🚀  Server ready at: ${url}`);
})();
