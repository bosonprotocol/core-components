import "@rainbow-me/rainbowkit/styles.css";

import {
  AvatarComponent,
  darkTheme,
  RainbowKitProvider,
  Theme
} from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";
import React, { ReactNode } from "react";
import { WagmiConfig } from "wagmi";
import { theme } from "../../theme";
import FallbackAvatar from "../avatar/fallback-avatar";
import { useCSSVariable } from "../styles/useCSSVariable";
import { useWagmiConfig } from "./wallet-connection";
import { useConfigContext } from "../config/ConfigContext";

export type WalletConnectionProviderProps = {
  children: ReactNode;
  walletConnectProjectId: string;
};
const colors = theme.colors.light;
export default function WalletConnectionProvider({
  children,
  walletConnectProjectId
}: WalletConnectionProviderProps) {
  const { withExternalConnectionProps } = useConfigContext();

  return withExternalConnectionProps ? (
    <>{children}</>
  ) : (
    <WagmiProvider walletConnectProjectId={walletConnectProjectId}>
      {children}
    </WagmiProvider>
  );
}

function WagmiProvider({
  children,
  walletConnectProjectId
}: WalletConnectionProviderProps) {
  const { wagmiConfig, chains } = useWagmiConfig(walletConnectProjectId);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKit chains={chains}>{children}</RainbowKit>
    </WagmiConfig>
  );
}

type RainbowKitProps = {
  children: ReactNode;
  chains: Parameters<typeof RainbowKitProvider>[0]["chains"];
};

function RainbowKit({ children, chains }: RainbowKitProps) {
  const secondaryColor = useCSSVariable("--secondary");
  const accentDarkColor = useCSSVariable("--accentDark");
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
    <RainbowKitProvider
      chains={chains}
      theme={walletConnectionTheme}
      avatar={CustomAvatar}
      appInfo={{ appName: "Boson Widgets" }}
    >
      {children}
    </RainbowKitProvider>
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
