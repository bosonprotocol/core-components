import { ReactNode } from "react";
import styled from "styled-components";
import { closeWidget } from "../../closeWidget";
import { colors } from "../../colors";
import { hooks, metaMask } from "../../connectors/metamask";
import { ReactComponent as Logo } from "./logo.svg";
import { ReactComponent as Close } from "./close.svg";
import { connectWallet } from "../../connectWallet";

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
  left: 16px;
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

const ConnectionSuccess = styled.button`
  all: unset;
  background-color: ${colors.cyberSpaceGray};
  border: solid 1px ${colors.neonGreen};
  color: white;
  padding: 0px 4px 0px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;

  > svg {
    display: inline-block;
    margin-left: 4px;
  }
  cursor: pointer;
`;

const CloseButton = styled.button`
  all: unset;
  position: absolute;
  right: 16px;
  top: 16px;
`;

const CloseIcon = styled.div`
  width: 24px;
  height: 24px;
  opacity: 0.3;
  position: relative;
  cursor: pointer;
  :hover {
    opacity: 1;
  }
  :before,
  :after {
    position: absolute;
    left: 15px;
    content: " ";
    height: 24px;
    width: 2px;
    background-color: ${colors.satinWhite};
  }
  :before {
    transform: rotate(45deg);
  }
  :after {
    transform: rotate(-45deg);
  }
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

interface Props {
  children: ReactNode;
  title: string;
  offerName: string;
  hideWallet?: boolean;
  hideCloseButton?: boolean;
}

export function WidgetLayout({
  children,
  title,
  offerName,
  hideWallet,
  hideCloseButton
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
      {!hideCloseButton && (
        <CloseButton onClick={closeWidget}>
          <CloseIcon />
        </CloseButton>
      )}
      {!hideWallet && (
        <WalletConnection>
          {isActive ? (
            <ConnectionSuccess onClick={() => metaMask.deactivate()}>
              {truncateAddress(account as string)} <Close />
            </ConnectionSuccess>
          ) : (
            <ConnectButton onClick={connectWallet}>
              Connect Wallet
            </ConnectButton>
          )}
        </WalletConnection>
      )}
      <Title>{title}</Title>
      <OfferName>{offerName}</OfferName>
      <Content>{children}</Content>
      <Center>
        <StyledLogo />
      </Center>
    </Root>
  );
}
