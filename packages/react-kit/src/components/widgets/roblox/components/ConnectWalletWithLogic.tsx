import React from "react";
import { ConnectWallet } from "../../../wallet2/web3Status";
import { BaseButton } from "../../../buttons/BaseButton";
import { useAccount } from "../../../../hooks";
import { useDisconnect } from "../../../../hooks/connection/useDisconnect";
import { StyledPower } from "./styles";
import { getCssVar } from "../../../../theme";

export type ConnectWalletWithLogicProps = {
  connectWalletButtonDisabled: boolean;
};
export const ConnectWalletWithLogic = ({
  connectWalletButtonDisabled
}: ConnectWalletWithLogicProps) => {
  const { address } = useAccount();
  const disconnect = useDisconnect();

  return address ? (
    <BaseButton
      theme={{
        background: getCssVar("--background-accent-color"),
        color: getCssVar("--button-text-color"),
        borderRadius: getCssVar("--button-border-radius"),
        borderColor: getCssVar("--button-text-color"),
        hover: {
          background: getCssVar("--main-accent-color"),
          color: getCssVar("--button-text-color")
        }
      }}
      onClick={() => disconnect({ isUserDisconnecting: true })}
    >
      Disconnect Account <StyledPower size={20} />
    </BaseButton>
  ) : (
    <ConnectWallet
      connectWalletButtonDisabled={connectWalletButtonDisabled}
      connectWalletButtonTheme={{
        background: getCssVar("--main-accent-color"),
        color: getCssVar("--button-text-color"),
        borderRadius: getCssVar("--button-border-radius"),
        hover: {
          background: getCssVar("--background-color"),
          color: getCssVar("--button-text-color"),
          borderColor: getCssVar("--button-text-color")
        }
      }}
      connectedButtonTheme={{
        background: getCssVar("--main-accent-color"),
        color: getCssVar("--button-text-color"),
        borderRadius: getCssVar("--button-border-radius"),
        hover: {
          background: getCssVar("--background-color"),
          color: getCssVar("--button-text-color"),
          borderColor: getCssVar("--button-text-color")
        }
      }}
      errorButtonTheme={{
        background: getCssVar("--main-accent-color"),
        color: getCssVar("--button-text-color"),
        borderRadius: getCssVar("--button-border-radius"),
        hover: {
          background: getCssVar("--background-color"),
          color: getCssVar("--button-text-color"),
          borderColor: getCssVar("--button-text-color")
        }
      }}
      connectWalletChild="Connect Account"
    />
  );
};
