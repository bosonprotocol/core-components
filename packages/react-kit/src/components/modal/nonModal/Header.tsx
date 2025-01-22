import React, { Fragment, ReactNode } from "react";
import { getCssVar } from "../../../theme";
import styled from "styled-components";
import { ArrowLeft, X } from "phosphor-react";
import { Grid } from "../../ui/Grid";
import { bosonButtonThemes } from "../../ui/ThemedButton";
import { useBreakpoints } from "../../../hooks/useBreakpoints";
import { BosonConnectWallet } from "../../wallet2/web3Status/BosonConnectWallet";
import { BaseButton, BaseButtonTheme } from "../../buttons/BaseButton";

const Wrapper = styled.div<{ $flexWrap: string }>`
  box-sizing: border-box;
  container-type: inline-size;
  position: relative;
  width: 100%;
  text-align: left;
  padding: 1rem 2rem;
  display: flex;
  flex-wrap: ${({ $flexWrap }) => $flexWrap};
  border-bottom: 2px solid ${getCssVar("--background-color")};
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;

  > * {
    margin: 0;
    align-self: center;
  }
`;
const closeTheme = {
  ...bosonButtonThemes().blank,
  padding: 0,
  borderWidth: 0,
  svg: {
    line: {
      stroke: getCssVar("--main-text-color")
    }
  },
  hover: {
    svg: {
      line: {
        stroke: `color-mix(
          in srgb,
          ${getCssVar("--main-text-color")} 50%,
          transparent 50%
        )`
      }
    }
  }
} satisfies BaseButtonTheme;
const Close = styled(X)`
  color: unset;
  && {
    stroke: unset;
  }
`;
const arrowLeftTheme = {
  ...bosonButtonThemes().blank,
  padding: 0,
  borderWidth: 0,
  svg: {
    line: {
      stroke: getCssVar("--main-text-color")
    },
    polyline: {
      stroke: getCssVar("--main-text-color")
    }
  },
  hover: {
    svg: {
      line: {
        stroke: `color-mix(
          in srgb,
          ${getCssVar("--main-text-color")} 50%,
          transparent 50%
        )`
      },
      polyline: {
        stroke: `color-mix(
          in srgb,
          ${getCssVar("--main-text-color")} 50%,
          transparent 50%
        )`
      }
    }
  }
} satisfies BaseButtonTheme;
const StyledArrowLeft = styled(ArrowLeft)`
  color: unset;
`;

type HeaderProps = {
  HeaderComponent: ReactNode;
  closable: boolean;
  withLeftArrowButton: boolean;
  handleOnCloseClick: () => void;
  handleOnArrowLeftClick: () => void;
  showConnectButton: boolean;
};

const Header: React.FC<HeaderProps> = ({
  HeaderComponent,
  closable,
  withLeftArrowButton,
  handleOnCloseClick,
  handleOnArrowLeftClick,
  showConnectButton
}) => {
  const { isLteXS } = useBreakpoints();
  const InnerContainer = isLteXS ? Grid : Fragment;
  return (
    <Wrapper $flexWrap={isLteXS ? "wrap" : "nowrap"}>
      <InnerContainer>
        {closable && withLeftArrowButton && (
          <BaseButton
            data-close
            theme={arrowLeftTheme}
            onClick={handleOnArrowLeftClick}
            id="close"
          >
            <StyledArrowLeft size={32} />
          </BaseButton>
        )}
        {HeaderComponent}
        {showConnectButton && !isLteXS && <BosonConnectWallet />}
        {closable && !withLeftArrowButton && (
          <BaseButton
            data-close
            theme={closeTheme}
            onClick={handleOnCloseClick}
            id="close"
          >
            <Close size={32} />
          </BaseButton>
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
