import { AuthOptions } from "next-auth";
import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "ethereum",
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        } as CredentialInput,
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          if (!(credentials?.message && credentials?.signature)) {
            throw new Error("Missing Credentials");
          }

          const siwe = new SiweMessage(JSON.parse(credentials.message));
          const nextAuthUrl = new URL(
            process.env.NEXTAUTH_URL || "http://localhost:3000/"
          );
          const csrf = await getCsrfToken({ req: { headers: req.headers } });

          const result = await siwe.verify({
            signature: credentials.signature,
            domain: nextAuthUrl.host,
            nonce: csrf,
          });

          if (result.success) {
            return {
              id: siwe.address,
            };
          }

          return null;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user.address = token.sub;
      session.user.name = token.sub;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
