import * as jwt from "jsonwebtoken";

export function getUserId(authHeader: string): number | null {
  const token = authHeader.replace("Bearer ", "");
  try {
    const { userId } = jwt.verify(token, process.env.SECRET_KEY as string) as jwt.JwtPayload;
    return userId;
  } catch (err) {
    return null;
  }
}
