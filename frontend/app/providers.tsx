"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { zkSync, zkSyncSepoliaTestnet } from "viem/zksync";
import { WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context";

const config = getDefaultConfig({
  appName: "Fuzion",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  chains: [zkSync, zkSyncSepoliaTestnet],
  ssr: true,
});

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ChakraProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <AuthProvider>
              <RainbowKitProvider
                showRecentTransactions={true}
                coolMode
                initialChain={zkSyncSepoliaTestnet}
              >
                {mounted && children}
              </RainbowKitProvider>
            </AuthProvider>
          </SessionProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ChakraProvider>
  );
};

export default Providers;
