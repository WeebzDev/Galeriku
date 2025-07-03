import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  CredentialsSignin,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as argon2 from "argon2";

import { db } from "@/server/db";
import { loginFormSchema } from "@/schemas";
import { QUERIES } from "../db/queries";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      role: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    role: string;
    // ...other properties
    // role: UserRole;
  }
}

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(request) {
        const validatedFields = loginFormSchema.safeParse(request);

        if (validatedFields.success) {
          const { username, password } = validatedFields.data;
          const users = await QUERIES.getUserByUsername(username);

          if (!users[0]?.password) return null;
          const passwordMatch = await argon2.verify(
            users[0].password,
            password,
          );

          const user = users[0];

          if (passwordMatch) {
            return {
              email: user.email,
              id: user.id,
              image: user.image,
              name: user.name,
              role: user.role,
              username: user.username,
            };
          } else {
            throw new InvalidLoginError();
          }
        }

        throw new InvalidLoginError();
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user, token }) {
      console.log({ type: "session", session, user, token });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      console.log({ type: "token", token });

      const existingUsers = await QUERIES.getUserById(token.sub);
      if (!existingUsers.length) return token;
      const existingUser = existingUsers[0];
      token.name = existingUser?.name;
      token.email = existingUser?.email;
      token.role = existingUser?.role;

      return token;
    },
  },
} satisfies NextAuthConfig;
