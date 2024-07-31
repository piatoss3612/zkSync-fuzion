import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextAuthSessionProvider refetchInterval={0}>
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
