import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { authConfig } from "@/auth.config";
import { db } from "@/lib/db";
import { isUserPremium } from "@/lib/premium";

const googleEnabled =
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  providers: [
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().toLowerCase().trim();
        const password = credentials?.password?.toString();

        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        const premium = await isUserPremium(user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.avatarUrl,
          role: user.role,
          isPremium: premium,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isPremium = user.isPremium ?? false;
      }
      if ((user || trigger === "update") && token.id) {
        token.isPremium = await isUserPremium(token.id as string);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as typeof session.user.role;
        session.user.isPremium = Boolean(token.isPremium);
      }
      return session;
    },
  },
  events: {
    async linkAccount({ user }) {
      const existing = await db.user.findUnique({ where: { id: user.id } });
      if (existing && existing.role === UserRole.reader && !existing.passwordHash) {
        await db.user.update({
          where: { id: user.id },
          data: { isVerified: true },
        });
      }
    },
  },
});
