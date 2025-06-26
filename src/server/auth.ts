import "server-only";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

import { env } from "@/env";

export const getSession = async (): Promise<{
  error: boolean;
  userId: string;
}> => {
  const cookie = await cookies();
  const token = cookie.get("wb-token");
  const encoder = new TextEncoder();
  const secret = env.JWT_SECRET;

  if (!token) {
    return { error: true, userId: "" };
  }

  const { payload } = await jwtVerify(token.value, encoder.encode(secret));

  if (payload.jti) {
    return { error: false, userId: payload.jti };
  } else {
    return { error: true, userId: "" };
  }
};
