import { Context } from "../types";
import { getUsers } from "../service/userService";

export async function users(_: any, __: null, contextValue: Context) {
  const { prisma } = contextValue;
  const users = await getUsers(prisma);
  return users;
}
