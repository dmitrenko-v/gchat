import { PrismaClient } from "@prisma/client";
import { MutationRegisterArgs } from "../types";

export async function validateUserData(
  data: MutationRegisterArgs,
  prisma: PrismaClient
) {
  const { email, firstName, secondName, userName } = data;

  const sameEmailCheck = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (sameEmailCheck)
    return { valid: false, message: "User with given email already exists" };

  const sameUserNameCheck = await prisma.user.findUnique({
    where: {
      userName: userName,
    },
  });

  if (sameUserNameCheck)
    return { valid: false, message: "User with given username already exists" };

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
  const userNameRegex = /^[a-zA-Z0-9_\.\-]{1,20}$/;
  const firstNameRegex = /^[a-zA-Z]{1,30}$/;
  const secondNameRegex = /^[a-zA-Z]{1,30}$/;
  if (
    emailRegex.test(email) &&
    userNameRegex.test(userName) &&
    firstNameRegex.test(firstName) &&
    secondNameRegex.test(secondName)
  ) {
    return { valid: true, message: "User data is valid" };
  }

  return { valid: false, message: "Data format is invalid" };
}
