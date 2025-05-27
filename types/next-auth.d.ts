// types/next-auth.d.ts or @types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      isVerified: boolean;
      hubName: string;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    token: string;
    hubId: {
      name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      isVerified: boolean;
      hubName: string;
    };
    accessToken: string;
    role: string;
  }
}
