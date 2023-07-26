import "@rainbow-me/rainbowkit/styles.css";

import { EnvironmentType } from "@bosonprotocol/core-sdk";
import {
  AvatarComponent,
  darkTheme,
  RainbowKitProvider,
  Theme
} from "@rainbow-me/rainbowkit";
import React, { ReactNode, useMemo } from "react";
import { WagmiConfig } from "wagmi";
import { theme } from "../../theme";
import merge from "lodash.merge";
import { getWagmiClient } from "./wallet-connection";
import { useCSSVariable } from "../styles/useCSSVariable";
import FallbackAvatar from "../avatar/fallback-avatar";

interface Props {
  children: ReactNode;
  envName: EnvironmentType;
}
const colors = theme.colors.light;
export default function WalletConnectionProvider({ children, envName }: Props) {
  const secondaryColor = useCSSVariable("--secondary");
  const accentDarkColor = useCSSVariable("--accentDark");
  const { wagmiClient, chains } = useMemo(() => {
    return getWagmiClient(envName);
  }, [envName]);
  const walletConnectionTheme = merge(darkTheme({ borderRadius: "medium" }), {
    colors: {
      accentColor: secondaryColor,
      accentColorForeground: accentDarkColor,
      closeButtonBackground: colors.navy,
      actionButtonBorder: colors.navy,
      profileForeground: colors.navy,
      modalBackground: colors.navy,
      modalBorder: colors.navy,
      modalText: colors.white,
      modalTextSecondary: colors.lightGrey
    },
    shadows: {
      connectButton: "none"
    },
    fonts: {
      body: "Plus Jakarta Sans, sans-serif"
    }
  } as Theme);
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={walletConnectionTheme}
        avatar={CustomAvatar}
        appInfo={{ appName: "Boson Widgets" }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return ensImage ? (
    <img
      src={ensImage}
      alt="Avatar"
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  ) : (
    <FallbackAvatar address={address} size={50} />
  );
};
