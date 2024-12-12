import React from "react";
import { ConnectWallet } from "../../../wallet2/web3Status";
import { BaseButton } from "../../../buttons/BaseButton";
import { useAccount } from "../../../../hooks";
import { useDisconnect } from "../../../../hooks/connection/useDisconnect";
import { StyledPower } from "./styles";
import { ButtonThemeProps } from "./types";

export type ConnectWalletWithLogicProps = {
  connectWalletButtonDisabled: boolean;
  buttonThemeProps: ButtonThemeProps;
};
export const ConnectWalletWithLogic = ({
  connectWalletButtonDisabled,
  buttonThemeProps
}: ConnectWalletWithLogicProps) => {
  const { address } = useAccount();
  const disconnect = useDisconnect();

  return address ? (
    <BaseButton
      theme={buttonThemeProps.inactive}
      onClick={() => disconnect({ isUserDisconnecting: true })}
    >
      Disconnect Account <StyledPower size={20} />
    </BaseButton>
  ) : (
    <ConnectWallet
      connectWalletButtonDisabled={connectWalletButtonDisabled}
      connectWalletButtonTheme={buttonThemeProps.active}
      connectedButtonTheme={buttonThemeProps.active}
      errorButtonTheme={buttonThemeProps.active}
      connectWalletChild="Connect Account"
    />
  );
};
