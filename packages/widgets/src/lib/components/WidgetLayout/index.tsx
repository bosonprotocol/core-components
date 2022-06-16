import { ReactNode } from "react";
import styled from "styled-components";
import { closeWidget } from "../../closeWidget";
import { colors } from "../../colors";
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

export interface Props {
  children?: ReactNode;
  WalletConnection?: ReactNode;
  title?: string;
  offerName?: string;
  hideCloseButton?: boolean;
}

export function WidgetLayout(props: Props) {
  return (
    <Root>
      {!props.hideCloseButton && (
        <CloseButton onClick={closeWidget}>
          <CloseIcon />
        </CloseButton>
      )}
      {props.WalletConnection && props.WalletConnection}
      {props.title && <Title>{props.title}</Title>}
      {props.offerName && <OfferName>{props.offerName}</OfferName>}
      <Content>{props.children}</Content>
      <Center>
        <StyledLogo />
      </Center>
    </Root>
  );
}
