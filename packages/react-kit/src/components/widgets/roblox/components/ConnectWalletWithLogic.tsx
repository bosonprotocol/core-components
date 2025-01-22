import React from "react";
import { ConnectWallet } from "../../../wallet2/web3Status";
import { useAccount, useOpenAccountDrawer } from "../../../../hooks";
import { StyledPower } from "./styles";
import ThemedButton, { bosonButtonThemes } from "../../../ui/ThemedButton";

const bosonThemes = bosonButtonThemes();
const primaryButtonTheme = bosonThemes["primary"];
const secondaryButtonTheme = bosonThemes["secondary"];
const orangeButtonTheme = bosonThemes["orange"];

export type ConnectWalletWithLogicProps = {
  connectWalletButtonDisabled: boolean;
};
export const ConnectWalletWithLogic = ({
  connectWalletButtonDisabled
}: ConnectWalletWithLogicProps) => {
  const { address } = useAccount();
  const [, openAccountDrawer] = useOpenAccountDrawer();

  return address ? (
    <ThemedButton themeVal="secondary" onClick={() => openAccountDrawer()}>
      Disconnect account <StyledPower size={20} />
    </ThemedButton>
  ) : (
    <ConnectWallet
      connectWalletButtonDisabled={connectWalletButtonDisabled}
      connectWalletButtonTheme={primaryButtonTheme}
      connectedButtonTheme={secondaryButtonTheme}
      errorButtonTheme={orangeButtonTheme}
      connectWalletChild="Connect account"
    />
  );
};
