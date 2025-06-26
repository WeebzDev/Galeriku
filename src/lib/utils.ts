import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type JWTPayload, SignJWT } from "jose";
import { env } from "@/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

export async function createJWT(
  payload: JWTPayload,
): Promise<string> {
  const encoder = new TextEncoder();
  const secret = env.JWT_SECRET;

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encoder.encode(secret));
  return jwt;
}
