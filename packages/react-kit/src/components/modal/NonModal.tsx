import React, { CSSProperties } from "react";
import { X } from "phosphor-react";
import { ReactNode } from "react";
import styled, { css } from "styled-components";

import { theme } from "../../theme";
import { Store } from "./ModalContext";
import Typography from "../ui/Typography";
import ThemedButton from "../ui/ThemedButton";
import { breakpoint } from "../../lib/ui/breakpoint";
import { zIndex } from "../ui/zIndex";

const colors = theme.colors.light;
const Root = styled.div`
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.Modal};
  max-height: 100vh;
  max-width: 100vw;
  overflow-y: auto;
  overflow-x: hidden;
`;

const RootBG = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #00000080;
  z-index: ${zIndex.Modal - 1};
`;

const sizeToMargin = {
  xs: {
    xs: "0",
    s: "0 12rem",
    m: "0 20rem",
    l: "0 24rem",
    xl: "0 30rem"
  },
  s: {
    xs: "0",
    s: "0 10rem",
    m: "0 19rem",
    l: "0 22rem",
    xl: "0 30rem"
  },
  m: {
    xs: "0",
    s: "0 6rem",
    m: "0 12rem",
    l: "0 16rem",
    xl: "0 25.75rem"
  },
  l: {
    xs: "0",
    s: "0",
    m: "0 8rem",
    l: "0 10rem",
    xl: "0 14rem"
  },
  auto: {
    xs: "0 auto",
    s: "0 auto",
    m: "0 auto",
    l: "0 auto",
    xl: "0 auto"
  },
  fullscreen: {
    xs: "0 auto",
    s: "0 auto",
    m: "0 auto",
    l: "0 auto",
    xl: "0 auto"
  }
} as const;

const background = {
  primaryBgColor: "var(--primaryBgColor)",
  dark: `${colors.black}`,
  light: `${colors.white}`
} as const;

const Wrapper = styled.div<{
  $size: NonModalProps["size"];
  $theme: NonModalProps["theme"];
  $maxWidths: NonModalProps["maxWidths"];
}>`
  position: relative;
  z-index: ${zIndex.Modal};
  color: ${({ $theme }) => {
    switch ($theme) {
      case "dark":
        return colors.white;
      default:
        return colors.black;
    }
  }};
  background-color: ${({ $theme }) => {
    return background[$theme as keyof typeof background] || colors.white;
  }};
  border: var(--secondary);
  ${({ $maxWidths }) => {
    if (!$maxWidths) {
      return "";
    }

    return css`
      ${breakpoint.xxs} {
        max-width: ${$maxWidths["xxs"]};
      }
      ${breakpoint.xs} {
        max-width: ${$maxWidths["xs"]};
      }
      ${breakpoint.s} {
        max-width: ${$maxWidths["s"]};
      }
      ${breakpoint.m} {
        max-width: ${$maxWidths["m"]};
      }
      ${breakpoint.l} {
        max-width: ${$maxWidths["l"]};
      }
      ${breakpoint.xl} {
        max-width: ${$maxWidths["xl"]};
      }
    `;
  }};
  margin: ${({ $size }) =>
    sizeToMargin[$size as keyof typeof sizeToMargin]["xs"] || 0};
  ${breakpoint.s} {
    margin: ${({ $size }) =>
      sizeToMargin[$size as keyof typeof sizeToMargin]["s"] || "4rem"};
  }
  ${breakpoint.m} {
    margin: ${({ $size }) =>
      sizeToMargin[$size as keyof typeof sizeToMargin]["m"] || "4rem 8rem"};
  }
  ${breakpoint.l} {
    margin: ${({ $size }) =>
      sizeToMargin[$size as keyof typeof sizeToMargin]["l"] || "4rem 10rem"};
  }
  ${breakpoint.xl} {
    margin: ${({ $size }) =>
      sizeToMargin[$size as keyof typeof sizeToMargin]["xl"] || "4rem 14rem"};
  }
  ${({ $size }) =>
    $size === "fullscreen" &&
    `
      min-height: 100vh;
    `};
`;

const Header = styled(Typography)<{ $title?: string }>`
  position: relative;

  text-align: left;
  padding: 1rem 2rem;
  display: flex;
  border-bottom: 2px solid ${colors.border};
  align-items: center;
  justify-content: ${(props) => {
    return props.$title ? "space-between" : "flex-end";
  }};
  gap: 0.5rem;
`;

const FooterWrapper = styled.div`
  border-top: 2px solid ${colors.border};
`;

const HeaderWithTitle = styled(Header)`
  height: 4.25rem;
`;

const Close = styled(X)`
  line {
    stroke: ${colors.darkGrey};
  }
`;

const Content = styled.div<{
  $size: NonModalProps["size"];
}>`
  padding: 2rem;
`;

export interface NonModalProps {
  hideModal?: (data?: unknown | undefined | null) => void;
  title?: string;
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  contentStyle?: CSSProperties;
  size?: NonNullable<Store["modalSize"]>;
  maxWidths?: Store["modalMaxWidth"];
  theme?: NonNullable<Store["theme"]>;
  closable?: boolean;
}

export default function NonModal({
  children,
  props: {
    hideModal,
    title = "",
    headerComponent: HeaderComponent,
    footerComponent: FooterComponent,
    size = "auto",
    maxWidths = null,
    theme = "light",
    contentStyle,
    closable = true
  }
}: {
  children: React.ReactNode;
  props: NonModalProps;
}) {
  const handleOnClose = () => {
    if (closable && hideModal) {
      hideModal();
    }
  };
  return (
    <Root data-testid="modal">
      <Wrapper $size={size} $theme={theme} $maxWidths={maxWidths}>
        {HeaderComponent ? (
          <Header tag="div" margin="0">
            {HeaderComponent}
            {closable && (
              <ThemedButton data-close theme="blank" onClick={handleOnClose}>
                <Close size={32} />
              </ThemedButton>
            )}
          </Header>
        ) : (
          <HeaderWithTitle tag="h3" $title={title} margin="0">
            {title}
            {closable && (
              <ThemedButton data-close theme="blank" onClick={handleOnClose}>
                <Close size={32} />
              </ThemedButton>
            )}
          </HeaderWithTitle>
        )}
        <Content $size={size} style={contentStyle}>
          {children}
        </Content>
        {FooterComponent && <FooterWrapper>{FooterComponent}</FooterWrapper>}
      </Wrapper>
      <RootBG
        onClick={() => {
          handleOnClose();
        }}
      />
    </Root>
  );
}
