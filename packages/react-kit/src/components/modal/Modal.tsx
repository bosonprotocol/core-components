import React, { CSSProperties } from "react";
import { X } from "phosphor-react";
import { ReactNode } from "react";
import { createPortal } from "react-dom";
import styled, { css } from "styled-components";

import { colors, getCssVar } from "../../theme";
import { ModalType, Store } from "./ModalContext";
import { Typography } from "../ui/Typography";
import ThemedButton from "../ui/ThemedButton";
import { breakpoint } from "../../lib/ui/breakpoint";
import { zIndex } from "../ui/zIndex";

const Root = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.Modal};
  max-height: inherit;
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
    s: "4rem 12rem",
    m: "4rem 20rem",
    l: "4rem 24rem",
    xl: "4rem 30rem"
  },
  s: {
    xs: "0",
    s: "4rem 10rem",
    m: "4rem 19rem",
    l: "4rem 22rem",
    xl: "4rem 30rem"
  },
  m: {
    xs: "0",
    s: "4rem 6rem",
    m: "4rem 12rem",
    l: "4rem 16rem",
    xl: "4rem 25.75rem"
  },
  l: {
    xs: "0",
    s: "4rem",
    m: "4rem 8rem",
    l: "4rem 10rem",
    xl: "4rem 14rem"
  },
  auto: {
    xs: "4rem auto",
    s: "4rem auto",
    m: "4rem auto",
    l: "4rem auto",
    xl: "4rem auto"
  },
  fullscreen: {
    xs: "0 auto",
    s: "0 auto",
    m: "0 auto",
    l: "0 auto",
    xl: "0 auto"
  }
} as const;

const Wrapper = styled.div<{
  $modalType: ModalType | string;
  $size: Props["size"];
  $maxWidths: Props["maxWidths"];
}>`
  display: flex;
  flex-direction: column;
  max-height: inherit;
  position: relative;
  z-index: ${zIndex.Modal};
  color: ${getCssVar("--main-text-color")};
  background-color: ${getCssVar("--background-accent-color")};
  border-radius: ${getCssVar("--modal-border-radius")};
  overflow: hidden;
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
  ${({ $modalType }) => {
    switch ($modalType) {
      case "FINANCE_WITHDRAW_MODAL":
      case "FINANCE_DEPOSIT_MODAL":
        return css`
          ${breakpoint.xs} {
            max-width: 31.25rem;
          }
        `;
      default:
        break;
    }
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
    css`
      min-height: 100vh;
    `};
`;
const closeButtonStyles = css`
  [data-close] {
    padding-right: 0;
  }
`;
const Header = styled(Typography)<{ $title?: string }>`
  position: relative;

  text-align: left;
  padding: 1rem 2rem;
  display: flex;
  border-bottom: 2px solid ${getCssVar("--border-color")};
  align-items: center;
  justify-content: ${(props) => {
    return props.$title ? "space-between" : "flex-end";
  }};
  gap: 0.5rem;
  ${closeButtonStyles}
`;

const FooterWrapper = styled.div`
  border-top: 2px solid ${getCssVar("--border-color")};
`;

const HeaderWithTitle = styled(Header)`
  height: 4.25rem;
  ${closeButtonStyles}
`;

const Close = styled(X)`
  line {
    stroke: ${colors.greyDark};
  }
`;

const Content = styled.div`
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
`;

interface Props {
  children: React.ReactNode;
  hideModal: (data?: unknown | undefined | null) => void;
  title?: string;
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  contentStyle?: CSSProperties;
  size: NonNullable<Store["modalSize"]>;
  maxWidths: Store["modalMaxWidth"];
  closable?: boolean;
  modalType: ModalType;
}

export default function Modal({
  children,
  hideModal,
  title = "",
  headerComponent: HeaderComponent,
  footerComponent: FooterComponent,
  size,
  maxWidths,
  contentStyle,
  closable = true,
  modalType
}: Props) {
  const handleOnClose = () => {
    if (closable) {
      hideModal();
    }
  };
  return createPortal(
    <Root data-testid="modal">
      <Wrapper $size={size} $modalType={modalType} $maxWidths={maxWidths}>
        {HeaderComponent ? (
          <Header tag="div" margin="0">
            {HeaderComponent}
            {closable && (
              <ThemedButton data-close themeVal="blank" onClick={handleOnClose}>
                <Close size={32} />
              </ThemedButton>
            )}
          </Header>
        ) : (
          <HeaderWithTitle tag="h3" $title={title} margin="0">
            {title}
            {closable && (
              <ThemedButton data-close themeVal="blank" onClick={handleOnClose}>
                <Close size={32} />
              </ThemedButton>
            )}
          </HeaderWithTitle>
        )}
        <Content style={contentStyle}>{children}</Content>
        {FooterComponent && <FooterWrapper>{FooterComponent}</FooterWrapper>}
      </Wrapper>
      <RootBG
        onClick={() => {
          handleOnClose();
        }}
      />
    </Root>,
    document.body
  );
}
