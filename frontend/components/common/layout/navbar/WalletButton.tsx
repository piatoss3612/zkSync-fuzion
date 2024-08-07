import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Button,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useAuth } from "@/hooks";
import { useDisconnect } from "wagmi";

const WalletButton = () => {
  const { isSignedIn, handleSignIn, handleSignOut } = useAuth();
  const { disconnect } = useDisconnect();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    w="full"
                    bg={{ base: "gray.100", lg: "white" }}
                    color="black"
                    rounded="xl"
                    boxShadow="md"
                    _hover={{
                      bgGradient: "linear(to-r, gray.100, gray.200)",
                    }}
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    w="full"
                    bgGradient="linear(to-r, red.300, red.500)"
                    color="white"
                    rounded="xl"
                    boxShadow="md"
                    _hover={{ bgGradient: "linear(to-r, red.200, red.400)" }}
                    onClick={openChainModal}
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <Stack
                  direction={{ base: "column", lg: "row" }}
                  spacing={2}
                  m={1}
                >
                  {!isSignedIn && (
                    <Button
                      w={{ base: "auto", lg: "120px" }}
                      onClick={handleSignIn}
                    >
                      Sign In
                    </Button>
                  )}
                  {isSignedIn && (
                    <>
                      <Button onClick={openChainModal}>
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: "1rem",
                              height: "1rem",
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </Button>
                      <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                          {account.displayName}
                        </MenuButton>
                        <MenuList color={"black"}>
                          <MenuGroup title="Menu">
                            <MenuItem onClick={openAccountModal}>
                              Account
                            </MenuItem>
                            <MenuItem onClick={() => disconnect()}>
                              Disconnect
                            </MenuItem>
                            <MenuItem onClick={handleSignOut}>
                              Sign Out
                            </MenuItem>
                          </MenuGroup>
                        </MenuList>
                      </Menu>
                    </>
                  )}
                </Stack>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletButton;
