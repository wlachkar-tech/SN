import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    token?: string;
    user: {
      id?: string;
      email?: string;
      name?: string;
      role?: string;
    };
  }

  interface JWT {
    id?: string;
    email?: string;
    role?: string;
    token?: string;
  }
}
