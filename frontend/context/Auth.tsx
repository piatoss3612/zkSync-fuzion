"use client";

import { createContext, useCallback, useEffect, useState } from "react";
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
import { Session } from "next-auth";

interface AuthContextValues {
  address: `0x${string}`;
  session: Session | null;
  isLoading: boolean;
  signedIn: boolean;
  handleSignIn: () => void;
  handleSignOut: () => void;
}

const AuthContext = createContext({
  address: `0x0`,
  session: null,
  isLoading: false,
  signedIn: false,
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
  const [signedIn, setSignedIn] = useState(false);

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
        signature: signature,
        redirect: false,
        callbackUrl: callbackUrl,
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
    if (!isConnected) {
      return;
    }

    await signOut({ callbackUrl: "/" });
  }, [isConnected]);

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

    if (chainId != zkSync.id && chainId != zkSyncSepoliaTestnet.id) {
      // Switch to zkSync Sepolia Testnet if the chain is not zkSync or zkSync Sepolia Testnet
      console.log("Switching chain to zkSync Sepolia Testnet...");
      switchChain({
        chainId: zkSyncSepoliaTestnet.id,
      });
    }
  }, [chainId]);

  useEffect(() => {
    if (signedIn && isDisconnected) {
      setSignedIn(false);
      handleSignOut();
    }
  }, [signedIn, isDisconnected]);

  return (
    <AuthContext.Provider
      value={{
        address: address ? address : `0x0`,
        session,
        isLoading,
        signedIn,
        handleSignIn,
        handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
