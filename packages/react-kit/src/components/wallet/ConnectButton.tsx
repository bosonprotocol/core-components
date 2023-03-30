import React from "react";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import * as Sentry from "@sentry/browser";
import styled from "styled-components";

import metamaskLogo from "../../assets/metamask-logo.svg";
import FallbackAvatar from "../avatar/fallback-avatar";
import { Button, ButtonSize } from "../buttons/Button";
import ThemedButton from "../ui/ThemedButton";
import { useBreakpoints } from "../../hooks/useBreakpoints";
import { saveItemInStorage } from "../widgets/finance/storage/useLocalStorage";
import { useDisconnect } from "wagmi";
import { Wallet } from "phosphor-react";

const MetaMaskLogo = styled.img`
  height: 15px;
  width: 16px;
`;

const ENSAvatar = styled.img`
  height: 20px;
  width: 20px;
  border-radius: 100%;
`;

interface Props {
  navigationBarPosition?: string;
  showAddress?: boolean;
  showChangeWallet?: boolean;
}

export default function ConnectButton({
  navigationBarPosition = "",
  showAddress = true,
  showChangeWallet,
  ...rest
}: Props) {
  const { isLteXS } = useBreakpoints();
  const isSideBar = ["left", "right"].includes(navigationBarPosition);
  const buttonPadding = isSideBar ? "0.75rem 1rem" : "";
  const justifyContent = isSideBar ? "center" : "";
  const width = isSideBar ? "100%" : "";
  const buttonPropsWhenSideBar = {
    ...(buttonPadding && { padding: buttonPadding }),
    ...(justifyContent && { justifyContent })
  };
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted
      }) => {
        account && Sentry.setTag("wallet_address", account?.address);

        return (
          <div
            style={{ display: "flex", gap: 12, padding: "10px 0" }}
            {...rest}
          >
            {(() => {
              <div
                {...(!mounted && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none"
                  }
                })}
                style={{ display: "flex" }}
              ></div>;
              if (!mounted || !account || !chain) {
                // reset the tag o undefined
                saveItemInStorage("isChainUnsupported", true);
                Sentry.setTag("wallet_address", undefined);

                return (
                  <Button
                    onClick={() => {
                      saveItemInStorage("isConnectWalletFromCommit", false);
                      openConnectModal();
                    }}
                    size={isLteXS ? ButtonSize.Small : ButtonSize.Medium}
                    variant="primaryFill"
                    style={{
                      whiteSpace: "pre",
                      ...buttonPropsWhenSideBar,
                      color: "inherit"
                    }}
                  >
                    Connect Wallet
                    {!isLteXS && <MetaMaskLogo src={metamaskLogo} />}
                  </Button>
                );
              }

              if (chain.unsupported) {
                saveItemInStorage("isChainUnsupported", true);
                return (
                  <ThemedButton
                    onClick={openChainModal}
                    theme="warning"
                    size={isLteXS ? "small" : "regular"}
                    style={{
                      whiteSpace: "pre",
                      ...buttonPropsWhenSideBar,
                      color: "inherit"
                    }}
                  >
                    Wrong network
                  </ThemedButton>
                );
              }
              saveItemInStorage("isChainUnsupported", false);
              return (
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    ...(justifyContent && { justifyContent }),
                    ...(width && { width })
                  }}
                >
                  {showChangeWallet && (
                    <Wallet
                      style={{ cursor: "pointer", height: "100%" }}
                      size={32}
                      onClick={async () => {
                        try {
                          await window.ethereum?.request({
                            method: "wallet_requestPermissions",
                            params: [
                              {
                                eth_accounts: {}
                              }
                            ]
                          });
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                    />
                  )}
                  <ThemedButton
                    onClick={openAccountModal}
                    theme="outline"
                    size={isLteXS ? "small" : "regular"}
                    style={{
                      whiteSpace: "pre",
                      ...buttonPropsWhenSideBar,
                      color: "inherit",
                      ...(!showAddress && { borderColor: "transparent" })
                    }}
                  >
                    {account.ensAvatar ? (
                      <ENSAvatar src={account.ensAvatar} />
                    ) : (
                      <FallbackAvatar address={account.address} size={18} />
                    )}
                    {showAddress && account.displayName}
                  </ThemedButton>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
