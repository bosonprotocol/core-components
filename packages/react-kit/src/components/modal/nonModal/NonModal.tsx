import React, {
  useContext,
  CSSProperties,
  useReducer,
  createContext,
  useMemo
} from "react";
import { colors, getCssVar } from "../../../theme";
import { ReactNode } from "react";
import styled, { css } from "styled-components";

import Header from "./Header";
import { Store } from "../ModalContext";
import { zIndex } from "../../ui/zIndex";
import { breakpoint } from "../../../lib/ui/breakpoint";
import { Content } from "./styles";

const Root = styled.div`
  position: relative;
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

const Wrapper = styled.div<{
  $size: NonModalProps["size"];
  $maxWidths: NonModalProps["maxWidths"];
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

const FooterWrapper = styled.div`
  border-top: 2px solid ${colors.border};
`;

export enum ActionKind {
  HEADER = "HEADER",
  CONTENT_STYLE = "CONTENT_STYLE"
}

type Action = {
  payload: Required<State>;
};

type State = Pick<
  NonModalProps,
  "headerComponent" | "contentStyle" | "footerComponent" | "onArrowLeftClick"
>;

const reducer = (state: State, action: Action): State => {
  const { payload } = action;
  return {
    ...state,
    ...payload
  };
};

const NonModalContext = createContext<
  { dispatch: React.Dispatch<Action>; showConnectButton: boolean } | undefined
>(undefined);
export const useNonModalContext = () => {
  const context = useContext(NonModalContext);
  if (!context) {
    throw new Error("useNonModalContext must be used within NonModalContext");
  }
  return context;
};

export interface NonModalProps {
  hideModal?: (data?: unknown | undefined | null) => void;
  onArrowLeftClick?: null | (() => unknown);
  withLeftArrowButton?: boolean;
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  contentStyle?: CSSProperties;
  size?: NonNullable<Store["modalSize"]>;
  maxWidths?: Store["modalMaxWidth"];
  closable?: boolean;
  lookAndFeel?: "modal" | "regular";
  children: ReactNode;
  showConnectButton: boolean;
}

export default function NonModal({
  children,
  withLeftArrowButton,
  hideModal,
  onArrowLeftClick,
  headerComponent,
  footerComponent,
  size = "auto",
  maxWidths = null,
  contentStyle: _contentStyle,
  closable = true,
  lookAndFeel = "modal",
  showConnectButton
}: NonModalProps) {
  const handleOnCloseClick = () => {
    if (closable && hideModal) {
      hideModal();
    }
  };

  const [
    {
      headerComponent: HeaderComponent,
      footerComponent: FooterComponent,
      contentStyle,
      onArrowLeftClick: onArrowLeftClickFromReducer
    },
    dispatch
  ] = useReducer(reducer, {
    headerComponent,
    footerComponent,
    contentStyle: _contentStyle,
    onArrowLeftClick
  });
  const handleOnArrowLeftClick = () => {
    if (onArrowLeftClickFromReducer) {
      onArrowLeftClickFromReducer();
    } else {
      handleOnCloseClick();
    }
  };
  const Container = useMemo(() => {
    return ({ children }: { children: ReactNode }) => {
      return lookAndFeel === "modal" ? (
        <Root data-testid="modal">
          {children}
          <RootBG
            onClick={() => {
              handleOnCloseClick();
            }}
          />
        </Root>
      ) : (
        <>{children}</>
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookAndFeel]);
  return (
    <Container>
      <NonModalContext.Provider value={{ dispatch, showConnectButton }}>
        <Wrapper $size={size} $maxWidths={maxWidths}>
          <Header
            HeaderComponent={HeaderComponent}
            withLeftArrowButton={
              !!withLeftArrowButton || !!onArrowLeftClickFromReducer
            }
            closable={closable}
            handleOnCloseClick={handleOnCloseClick}
            handleOnArrowLeftClick={handleOnArrowLeftClick}
            showConnectButton={showConnectButton}
          />

          <Content style={contentStyle}>{children}</Content>
          {FooterComponent ? (
            <FooterWrapper>{FooterComponent}</FooterWrapper>
          ) : (
            <div style={{ width: "947px", maxWidth: "100vw" }} />
          )}
        </Wrapper>
      </NonModalContext.Provider>
    </Container>
  );
}
