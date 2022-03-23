import { ReactNode } from "react";
import styled from "styled-components";
import { colors } from "../../colors";
import { hooks, metaMask } from "../../connectors/metamask";
import { ReactComponent as Logo } from "./logo.svg";

const StyledLogo = styled(Logo)`
  margin-top: 16px;
`;

const Root = styled.div`
  padding: 16px;
  padding-bottom: 16px;
  position: relative;
  background-color: ${colors.cyberSpaceGray};
  color: ${colors.satinWhite};
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 32px;
  text-align: center;
  margin-bottom: 4px;
  color: white;
`;

const OfferName = styled.div`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
`;

const WalletConnection = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const ConnectButton = styled.button`
  all: unset;
  background-color: ${colors.cyberSpaceGray};
  border: solid 1px ${colors.neonGreen};
  text-align: center;
  color: white;
  padding: 0px 8px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    filter: brightness(1.05);
  }
`;

const ConnectionSuccess = styled.div`
  background-color: ${colors.cyberSpaceGray};
  border: solid 1px ${colors.neonGreen};
  color: white;
  padding: 0px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

interface Props {
  children: ReactNode;
  title: string;
  offerName: string;
  hideWallet?: boolean;
}

export function WidgetLayout({
  children,
  title,
  offerName,
  hideWallet
}: Props) {
  const isActive = hooks.useIsActive();
  const account = hooks.useAccount();

  function truncateAddress(address: string) {
    const start = address.slice(0, 6);
    const end = address.slice(address.length - 6, address.length);

    return `${start}...${end}`;
  }

  return (
    <Root>
      {!hideWallet && (
        <WalletConnection>
          {isActive ? (
            <ConnectionSuccess>
              {truncateAddress(account as string)}
            </ConnectionSuccess>
          ) : (
            <ConnectButton onClick={() => metaMask.activate()}>
              Connect Wallet
            </ConnectButton>
          )}
        </WalletConnection>
      )}

      <Title>{title}</Title>
      <OfferName>{offerName}</OfferName>
      {children}
      <Center>
        <StyledLogo />
      </Center>
    </Root>
  );
}
