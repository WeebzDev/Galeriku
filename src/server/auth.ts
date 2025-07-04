import "server-only";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import { env } from "@/env";
import type { DB_UsersType } from "./db/schema";
import { QUERIES } from "./db/queries";

export const getSession = async (): Promise<{
  error: boolean;
  user: DB_UsersType | null;
}> => {
  const cookie = await cookies();
  const token = cookie.get("weebzdev.gl-token");
  const encoder = new TextEncoder();
  const secret = env.JWT_SECRET;

  if (!token) {
    return { error: true, user: null };
  }

  const { payload } = await jwtVerify(token.value, encoder.encode(secret));

  if (!payload.jti) {
    return { error: true, user: null };
  }

  const [existingUser] = await QUERIES.getUserByUserId(payload.jti);

  return {
    error: !existingUser,
    user: existingUser ?? null,
  };
};
