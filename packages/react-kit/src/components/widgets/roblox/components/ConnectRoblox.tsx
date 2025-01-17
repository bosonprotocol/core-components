import React, {
  ReactElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { css, styled } from "styled-components";
import { Grid } from "../../../ui/Grid";
import { Typography } from "../../../ui/Typography";
import { useAccount } from "../../../../hooks";
import { CheckCircle, Power } from "phosphor-react";
import { useIsRobloxLoggedIn } from "../../../../hooks/roblox/useIsRobloxLoggedIn";
import { useRobloxLogout } from "../../../../hooks/roblox/useRobloxLogout";
import { useRobloxConfigContext } from "../../../../hooks/roblox/context/useRobloxConfigContext";
import { ConnectWalletWithLogic } from "./ConnectWalletWithLogic";
import { useGetRobloxWalletAuth } from "../../../../hooks/roblox/useGetRobloxWalletAuth";
import { useRobloxBackendLogin } from "../../../../hooks/roblox/useRobloxBackendLogin";
import { useQuery } from "react-query";
import { useDisconnect } from "../../../../hooks/connection/useDisconnect";
import { useCookies } from "react-cookie";
import {
  ROBLOX_OAUTH_COOKIE_NAME,
  WEB3AUTH_COOKIE_NAME
} from "@bosonprotocol/roblox-sdk";
import { useRobloxProducts } from "../../../../hooks/roblox/useRobloxProducts";
import { useRobloxExchanges } from "../../../../hooks/roblox/useRobloxExchanges";
import { LoginWithRoblox } from "./LoginWithRoblox";
import { getCssVar } from "../../../../theme";
import ThemedButton from "../../../ui/ThemedButton";
import { maxWidthStepper } from "./styles";
import { productsPageSize, purchasedProductsPageSize } from "./const";

const Wrapper = styled(Grid)`
  container-type: inline-size;
  display: flex;
  flex-direction: row;
  background-color: ${getCssVar("--background-accent-color")};
`;

const StyledPower = styled(Power)`
  && {
    stroke: initial;
  }
`;
const IconWrapper = styled.div`
  position: relative;
  padding-right: 15px;
  padding-left: 15px;
  background-color: inherit;
`;
const CardTitle = styled(Typography)``;
const iconClass = "icon";
const StepWrapperGrid = styled(Grid)<{
  $isActive: StepProps["isActive"];
  $isDone: StepProps["isDone"];
  $itemWidthPx: number;
}>`
  max-width: ${maxWidthStepper};
  min-height: 100%;
  align-self: stretch;
  background-color: ${getCssVar("--background-accent-color")};
  padding: 24px;
  svg.${iconClass} {
    ${({ $isActive }) => {
      return css`
        path:first-child {
          // background of the number
          fill: ${$isActive
            ? getCssVar("--main-accent-color")
            : getCssVar("--background-color")};
        }
        path:last-child {
          // number
          stroke: ${$isActive
            ? getCssVar("--main-button-text-color")
            : getCssVar("--main-text-color")};
        }
      `;
    }}
  }

  &:nth-of-type(1) ${IconWrapper} {
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 100%;
      width: calc(2 * ${({ $itemWidthPx }) => $itemWidthPx + "px"});
      height: 2px;
      background-color: ${getCssVar("--background-color")};
    }
  }
  @container (width < 692px) {
    ${CardTitle} {
      min-height: 45px;
    }
  }
`;

type StepProps = {
  icon: ReactElement;
  title: string;
  subtitle: string;
  isActive: boolean;
  isDone: boolean;
  button: ReactElement;
};
const Step = forwardRef<HTMLDivElement, StepProps>(
  ({ icon: Icon, title, subtitle, isActive, isDone, button: Button }, ref) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const [itemWidthPx, setItemWidthPx] = useState(0);

    const updateWidth = () => {
      if (itemRef.current) {
        setItemWidthPx(itemRef.current.getBoundingClientRect().width || 0);
      }
    };

    useEffect(() => {
      updateWidth();

      window.addEventListener("resize", updateWidth);

      return () => {
        window.removeEventListener("resize", updateWidth);
      };
    }, []);
    return (
      <StepWrapperGrid
        ref={(innerRef) => {
          if (innerRef) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            itemRef.current = innerRef;
            if (ref) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ref.current = innerRef;
            }
          }
        }}
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        $isActive={isActive}
        $isDone={isDone}
        $itemWidthPx={itemWidthPx}
      >
        <IconWrapper>
          {isDone ? (
            <CheckCircle
              size={41}
              color={getCssVar("--main-accent-color")}
              className={iconClass}
            />
          ) : (
            React.cloneElement(Icon, { className: iconClass })
          )}
        </IconWrapper>
        <CardTitle
          tag="h4"
          margin={0}
          textAlign="center"
          // @ts-expect-error textWrap is supported by browser
          style={{ textWrap: "balance" }}
        >
          {title}
        </CardTitle>
        <Typography
          tag="p"
          margin="0.25rem 0 1rem 0"
          color={getCssVar("--sub-text-color")}
          textAlign="center"
          // @ts-expect-error textWrap is supported by browser
          style={{ textWrap: "pretty", flexGrow: 1 }}
        >
          {subtitle}
        </Typography>
        {Button}
      </StepWrapperGrid>
    );
  }
);

export type ConnectRobloxProps = {
  sellerId: string;
  step3: {
    title: string;
    subtitle: string;
    buttonText: string;
    callback: (() => void) | (() => Promise<void>);
  };
};

type ActiveStep = 0 | 1 | 2;
export const ConnectRoblox = forwardRef<HTMLDivElement, ConnectRobloxProps>(
  ({ step3, sellerId }, ref) => {
    const { address = "" } = useAccount();
    const [isSignUpDone, setSignUpDone] = useState<boolean>(false);
    const [activeStep, setActiveStep] = useState<ActiveStep>(0);
    const disconnect = useDisconnect();
    const { backendOrigin } = useRobloxConfigContext();
    const removeCookie = useCookies(
      [ROBLOX_OAUTH_COOKIE_NAME, WEB3AUTH_COOKIE_NAME],
      { doNotUpdate: true }
    )[2];
    const { refetch: loadBosonProducts } = useRobloxProducts({
      sellerId,
      pageSize: productsPageSize,
      statuses: [],
      options: { enabled: false }
    });
    const { refetch: loadBosonExchanges } = useRobloxExchanges({
      sellerId,
      userWallet: address,
      pageSize: purchasedProductsPageSize,
      options: { enabled: false }
    });
    const disconnectWallet = useCallback(() => {
      console.log("disconnectWallet()");
      // setIsSigning(false);
      // setIsWalletAuthenticated(false);
      // const domain = backendOrigin
      //   .replace("https://", "")
      //   .replace("http://", "");
      const isHttps = ((backendOrigin || "") as string).startsWith("https");
      const sameSite = isHttps ? "none" : undefined;
      removeCookie?.(WEB3AUTH_COOKIE_NAME, { path: "/", sameSite }); // TODO: no domain?
      disconnect({ isUserDisconnecting: false });
      loadBosonProducts(); // Refresh products
      loadBosonExchanges(); // Refresh exchanges
    }, [
      removeCookie,
      disconnect,
      backendOrigin,
      loadBosonProducts,
      loadBosonExchanges
    ]);
    const { data: robloxLoggedInData } = useIsRobloxLoggedIn({
      sellerId,
      options: {
        enabled: true,
        onSuccess: (data) => {
          if (!data?.isLoggedIn && address) {
            // Roblox auth is not valid, disconnect the wallet if connected
            console.log(
              "Roblox auth is not valid, disconnect the wallet if connected"
            );
            disconnectWallet();
          }
        }
      }
    });
    const { data: isAuthChecked } = useGetRobloxWalletAuth({
      sellerId,
      options: {
        enabled: !!robloxLoggedInData?.isLoggedIn
      }
    });
    const {
      mutateAsync: robloxBackendLoginAsync,
      data: isWalletAuthenticatedSigned
    } = useRobloxBackendLogin({
      loggedInData: robloxLoggedInData,
      sellerId,
      mutationKey: [
        address,
        isAuthChecked?.walletAuth,
        isAuthChecked,
        robloxLoggedInData
      ],
      options: {
        onError: (...args) => {
          console.error("robloxBackendLoginAsync error", { ...args });
          disconnectWallet();
        }
      }
    });
    const isWalletAuthenticated =
      isWalletAuthenticatedSigned || isAuthChecked?.walletAuth;

    useQuery(
      [robloxLoggedInData, address, isAuthChecked],
      () => {
        if (robloxLoggedInData?.claims && robloxLoggedInData?.nonce) {
          robloxBackendLoginAsync();
        } else {
          console.error("robloxLoggedInData is not valid");
        }
      },
      {
        staleTime: Infinity,
        enabled:
          !!robloxLoggedInData?.isLoggedIn &&
          !!address &&
          !!isAuthChecked &&
          !isWalletAuthenticated
      }
    );

    const { mutateAsync: robloxLogoutAsync } = useRobloxLogout();
    const nextLatestActiveStep = (step: ActiveStep) => {
      setActiveStep((activeStep) => Math.max(step, activeStep) as ActiveStep);
    };
    const isRobloxLoggedIn = !!robloxLoggedInData?.isLoggedIn;
    const robloxNickname = robloxLoggedInData?.claims?.nickname || "";
    useEffect(() => {
      if (isRobloxLoggedIn) {
        nextLatestActiveStep(1);
      }
    }, [isRobloxLoggedIn]);
    useEffect(() => {
      if (address && isRobloxLoggedIn) {
        nextLatestActiveStep(2);
      }
    }, [address, isRobloxLoggedIn]);
    const isConnectWalletStepActive = activeStep >= 1 || !!address;
    return (
      <Wrapper justifyContent="center">
        <Step
          ref={ref}
          isActive={true}
          isDone={isRobloxLoggedIn}
          icon={
            <svg
              width="41"
              height="41"
              viewBox="0 0 41 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M32.8334 6.56152H7.83337C7.14302 6.56152 6.58337 7.12117 6.58337 7.81152V32.8115C6.58337 33.5019 7.14302 34.0615 7.83337 34.0615H32.8334C33.5237 34.0615 34.0834 33.5019 34.0834 32.8115V7.81152C34.0834 7.12117 33.5237 6.56152 32.8334 6.56152Z" />
              <path
                d="M17.2084 15.9354L20.9584 13.4365V27.8115"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
          title={
            isRobloxLoggedIn && robloxNickname
              ? `Connected as ${robloxNickname}`
              : "Connect your Roblox account"
          }
          subtitle="Depending on your inventory you will see which exclusive products you can buy."
          button={
            isRobloxLoggedIn ? (
              <ThemedButton
                themeVal="secondary"
                onClick={async () => {
                  await robloxLogoutAsync();
                }}
              >
                Logout Roblox <StyledPower size={20} />
              </ThemedButton>
            ) : (
              <LoginWithRoblox
                sellerId={sellerId}
                onLoggedIn={() => {
                  nextLatestActiveStep(1);
                }}
                onDisconecctWallet={() => {
                  disconnectWallet();
                }}
              />
            )
          }
        />
        <Step
          isActive={isConnectWalletStepActive}
          isDone={!!address}
          icon={
            <svg
              width="40"
              height="41"
              viewBox="0 0 40 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M32.5 6.56152H7.5C6.80964 6.56152 6.25 7.12117 6.25 7.81152V32.8115C6.25 33.5019 6.80964 34.0615 7.5 34.0615H32.5C33.1904 34.0615 33.75 33.5019 33.75 32.8115V7.81152C33.75 7.12117 33.1904 6.56152 32.5 6.56152Z" />
              <path
                d="M16.5447 15.102C16.7483 14.6202 17.0504 14.1863 17.4317 13.8283C17.8129 13.4702 18.2649 13.1958 18.7584 13.0228C19.252 12.8497 19.7763 12.7818 20.2977 12.8234C20.8191 12.865 21.326 13.0152 21.7859 13.2643C22.2458 13.5135 22.6485 13.856 22.9681 14.27C23.2877 14.684 23.5173 15.1603 23.6419 15.6683C23.7666 16.1762 23.7836 16.7046 23.6919 17.2196C23.6002 17.7345 23.4019 18.2246 23.1096 18.6583V18.6583L16.25 27.8116V27.8107H23.75"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
          title="Create an account"
          subtitle="Linking your Roblox account to your wallet to signal your permission."
          button={
            <ConnectWalletWithLogic connectWalletButtonDisabled={false} />
          }
        />
        <Step
          isActive={activeStep === 2}
          isDone={isSignUpDone}
          icon={
            <svg
              width="41"
              height="41"
              viewBox="0 0 41 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M33.1666 6.56152H8.16663C7.47627 6.56152 6.91663 7.12117 6.91663 7.81152V32.8115C6.91663 33.5019 7.47627 34.0615 8.16663 34.0615H33.1666C33.857 34.0615 34.4166 33.5019 34.4166 32.8115V7.81152C34.4166 7.12117 33.857 6.56152 33.1666 6.56152Z" />
              <path
                d="M16.9166 13.4365H24.4156L20.0422 19.6872C20.7616 19.6872 21.4699 19.8646 22.1044 20.2037C22.7389 20.5428 23.28 21.0332 23.6797 21.6314C24.0794 22.2295 24.3254 22.917 24.3959 23.633C24.4665 24.3489 24.3593 25.0712 24.084 25.7359C23.8087 26.4006 23.3738 26.9871 22.8176 27.4435C22.2615 27.8999 21.6014 28.2121 20.8958 28.3525C20.1902 28.4928 19.4609 28.457 18.7725 28.2482C18.084 28.0393 17.4577 27.6639 16.949 27.1552"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
          title={step3.title}
          subtitle={step3.subtitle}
          button={
            <ThemedButton
              themeVal="secondary"
              disabled={activeStep !== 2}
              onClick={async () => {
                await step3.callback();
                setSignUpDone(true);
              }}
            >
              {step3.buttonText}
            </ThemedButton>
          }
        />
      </Wrapper>
    );
  }
);
