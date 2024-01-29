import { Context } from "./types";
import { readFileSync } from "fs";
import { join } from "path";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import express from "express";
import cors from "cors";

import * as Mutation from "./resolvers/Mutation";
import * as Message from "./resolvers/Message";
import * as Query from "./resolvers/Query";
import * as Subscription from "./resolvers/Subscription";
import * as User from "./resolvers/User";
import * as Chat from "./resolvers/Chat";
import { getUserId } from "./utils/parseToken";
import dotenv from "dotenv";
dotenv.config();

const resolvers = { Mutation, Query, User, Chat, Message, Subscription };
const typeDefs = readFileSync(join(__dirname, "schema.graphql"), {
  encoding: "utf-8",
});

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

export const prisma = new PrismaClient();

export const pubsub = new PubSub();

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer<Context>({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

async function startServer() {
  await server.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const userId = req && req.headers.authorization ? getUserId(req.headers.authorization) : null;
        return {
          pubsub,
          userId,
          res,
        };
      },
    })
  );
  httpServer.listen(process.env.PORT, () => {
    console.log(`Server is now running on http://localhost:${process.env.PORT}/graphql`);
  });
}

startServer();
