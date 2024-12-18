import React, { Fragment, ReactNode } from "react";
import { theme } from "../../../theme";
import styled from "styled-components";
import { X } from "phosphor-react";
import { Grid } from "../../ui/Grid";
import ThemedButton from "../../ui/ThemedButton";
import { useBreakpoints } from "../../../hooks/useBreakpoints";
import { BosonConnectWallet } from "../../wallet2/web3Status/BosonConnectWallet";

const colors = theme.colors.light;
const Wrapper = styled.div<{ $flexWrap: string }>`
  box-sizing: border-box;
  container-type: inline-size;
  position: relative;
  width: 100%;
  text-align: left;
  padding: 1rem 1rem 1rem 2rem;
  display: flex;
  flex-wrap: ${({ $flexWrap }) => $flexWrap};
  border-bottom: 2px solid ${colors.border};
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;

  > * {
    margin: 0;
    align-self: center;
  }
`;

const Close = styled(X)`
  && {
    stroke: unset;
  }

  line {
    stroke: ${colors.greyDark};
  }
`;

type HeaderProps = {
  HeaderComponent: ReactNode;
  closable: boolean;
  handleOnClose: () => void;
  showConnectButton: boolean;
};

const Header: React.FC<HeaderProps> = ({
  HeaderComponent,
  closable,
  handleOnClose,
  showConnectButton
}) => {
  const { isLteXS } = useBreakpoints();
  const InnerContainer = isLteXS ? Grid : Fragment;
  return (
    <Wrapper $flexWrap={isLteXS ? "wrap" : "nowrap"}>
      <InnerContainer>
        {HeaderComponent}
        {showConnectButton && !isLteXS && <BosonConnectWallet />}
        {closable && (
          <ThemedButton
            data-close
            themeVal="blank"
            onClick={handleOnClose}
            id="close"
          >
            <Close size={32} />
          </ThemedButton>
        )}
      </InnerContainer>

      {showConnectButton && isLteXS && (
        <Grid justifyContent="flex-end">
          <BosonConnectWallet />
        </Grid>
      )}
    </Wrapper>
  );
};

export default Header;
