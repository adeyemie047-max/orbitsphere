import type { UserRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      isPremium: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    isPremium?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    isPremium?: boolean;
  }
}

export type { UserRole };
