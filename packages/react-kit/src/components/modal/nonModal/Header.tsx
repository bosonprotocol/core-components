import React, { ReactNode } from "react";
import { theme } from "../../../theme";
import styled from "styled-components";
import { X } from "phosphor-react";
import Grid from "../../ui/Grid";
import ConnectButton from "../../wallet/ConnectButton";
import ThemedButton from "../../ui/ThemedButton";
import Typography from "../../ui/Typography";

const colors = theme.colors.light;
const Wrapper = styled(Typography)<{ $title?: string }>`
  position: relative;

  text-align: left;
  padding: 1rem 2rem;
  display: flex;
  border-bottom: 2px solid ${colors.border};
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const Close = styled(X)`
  line {
    stroke: ${colors.darkGrey};
  }
`;

type HeaderProps = {
  HeaderComponent: ReactNode;
  closable: boolean;
  handleOnClose: () => void;
};

const Header: React.FC<HeaderProps> = ({
  HeaderComponent,
  closable,
  handleOnClose
}) => {
  return (
    <>
      {HeaderComponent && (
        <Wrapper tag="div" margin="0">
          {HeaderComponent}
          <Grid justifyContent="flex-end">
            <ConnectButton showChangeWallet />
            {closable && (
              <ThemedButton data-close theme="blank" onClick={handleOnClose}>
                <Close size={32} />
              </ThemedButton>
            )}
          </Grid>
        </Wrapper>
      )}
    </>
  );
};

export default Header;
