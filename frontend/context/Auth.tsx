"use client";

import { createContext, useEffect, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import {
  useAccount,
  useDisconnect,
  useSignMessage,
  useSwitchChain,
} from "wagmi";
import { zkSync, zkSyncSepoliaTestnet } from "viem/zksync";
import { useToast } from "@chakra-ui/react";

interface AuthContextValues {
  address: `0x${string}`;
  isLoading: boolean;
  signedIn: boolean;
  handleSignOut: () => void;
}

const AuthContext = createContext({
  address: `0x0`,
  isLoading: false,
  signedIn: false,
  handleSignOut: async () => {},
} as AuthContextValues);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = useToast();
  const { data: session, status } = useSession();
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { openConnectModal } = useConnectModal();
  const { disconnectAsync } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const isLoading = status === "loading";
  const [signedIn, setSignedIn] = useState(false);

  const handleSignIn = async () => {
    try {
      if (!address || !isConnected) {
        if (openConnectModal) {
          openConnectModal();
          return;
        } else {
          throw new Error("Please connect your wallet first.");
        }
      }

      const callbackUrl = "/";
      const nonce = await getCsrfToken();

      const message = new SiweMessage({
        domain: window.location.host,
        uri: window.location.origin,
        version: "1",
        address: address,
        statement: "Sign in with Ethereum to Fuzion",
        nonce: nonce,
        chainId: chainId,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      const response = await signIn("ethereum", {
        message: JSON.stringify(message),
        signature: signature,
        redirect: false,
        callbackUrl: callbackUrl,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSignOut = async () => {
    if (!isConnected) {
      return;
    }

    await disconnectAsync();
    signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      setSignedIn(false);
    } else if (status === "authenticated") {
      setSignedIn(true);
    }
  }, [status]);

  useEffect(() => {
    // chainId is not available yet
    if (!chainId) {
      return;
    }

    if (chainId == zkSync.id || chainId == zkSyncSepoliaTestnet.id) {
      // If the chain is zkSync or zkSync Sepolia Testnet
      // Check if the user is connected and signed in
      // If the user is connected but not signed in, sign in the user
      if (isConnected && !session) {
        handleSignIn();
      } else if (!isConnected) {
        handleSignOut();
      }
    } else {
      // Switch to zkSync Sepolia Testnet if the chain is not zkSync or zkSync Sepolia Testnet
      console.log("Switching chain to zkSync Sepolia Testnet...");
      switchChain({
        chainId: zkSyncSepoliaTestnet.id,
      });
    }
  }, [chainId, isConnected, session]);

  return (
    <AuthContext.Provider
      value={{
        address: address ? address : `0x0`,
        isLoading,
        signedIn,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
