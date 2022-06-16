import { ReactNode } from "react";
import styled from "styled-components";
import { Actions, SecondaryButton } from "./shared-styles";
import { connectWallet } from "../../connectWallet";
import { getConfig } from "../../config";
import { hooks } from "../../connectors/metamask";

const ConnectButton = styled(SecondaryButton)`
  width: 100%;
`;

type Props = {
  BuyerActions: ReactNode;
  SellerActions: ReactNode;
  isSeller?: boolean;
};

export function ActionsWrapper(props: Props) {
  const account = hooks.useAccount();
  const { chainId } = getConfig();

  return (
    <>
      {!account ? (
        <Actions>
          <ConnectButton onClick={() => connectWallet(chainId)}>
            Connect Wallet
          </ConnectButton>
        </Actions>
      ) : props.isSeller ? (
        props.SellerActions
      ) : (
        props.BuyerActions
      )}
    </>
  );
}
