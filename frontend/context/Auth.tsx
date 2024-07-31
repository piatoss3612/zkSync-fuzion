"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage, useSwitchChain } from "wagmi";
import { zkSync, zkSyncSepoliaTestnet } from "viem/zksync";
import { useToast } from "@chakra-ui/react";
import { Session } from "next-auth";

interface AuthContextValues {
  address: `0x${string}`;
  session: Session | null;
  isLoading: boolean;
  isSignedIn: boolean;
  handleSignIn: () => void;
  handleSignOut: () => void;
}

const AuthContext = createContext({
  address: `0x0`,
  session: null,
  isLoading: false,
  isSignedIn: false,
  handleSignIn: async () => {},
  handleSignOut: async () => {},
} as AuthContextValues);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = useToast();

  const { data: session, status } = useSession();
  const { address, chainId, isConnected, isDisconnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { switchChain } = useSwitchChain();

  const isLoading = status === "loading";
  const isSignedIn = !!session && status === "authenticated";

  const handleSignIn = useCallback(async () => {
    try {
      if (!address || !isConnected) {
        throw new Error("Please connect your wallet first.");
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
        signature,
        redirect: false,
        callbackUrl,
      });

      if (!response) {
        throw new Error("Failed to sign in.");
      }

      if (response.ok) {
        toast({
          title: "Success",
          description: "You have successfully signed in.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }

      if (response.error) {
        throw new Error(response.error);
      }
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
  }, [address, chainId, isConnected, signMessageAsync, toast]);

  const handleSignOut = useCallback(async () => {
    // Do nothing if the user is not signed in
    if (!isSignedIn) {
      return;
    }

    // Sign out and redirect to the home page
    await signOut({ callbackUrl: "/" });
  }, [isSignedIn, isConnected]);

  useEffect(() => {
    // chainId is not available yet
    if (!chainId) {
      return;
    }

    // Switch to zkSync Sepolia Testnet if the chain is not zkSync or zkSync Sepolia Testnet
    if (chainId != zkSync.id && chainId != zkSyncSepoliaTestnet.id) {
      console.log("Switching chain to zkSync Sepolia Testnet...");
      switchChain({
        chainId: zkSyncSepoliaTestnet.id,
      });
    }
  }, [chainId]);

  useEffect(() => {
    // Sign out if the user is signed in but disconnected or the address is different
    if (isSignedIn) {
      if (isDisconnected || (session as any).user.address !== address) {
        handleSignOut();
      }
    }
  }, [address, isDisconnected, isSignedIn, session]);

  return (
    <AuthContext.Provider
      value={{
        address: address ? address : `0x0`,
        session,
        isLoading,
        isSignedIn,
        handleSignIn,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
