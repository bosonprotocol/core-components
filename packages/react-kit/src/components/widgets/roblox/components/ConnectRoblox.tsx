import React, { ReactElement, useEffect, useRef, useState } from "react";
import { CSSProperties, css, styled } from "styled-components";
import { Grid } from "../../../ui/Grid";
import { Typography } from "../../../ui/Typography";
import { BaseButton, BaseButtonTheme } from "../../../buttons/BaseButton";
import { ConnectWallet } from "../../../wallet2/web3Status";
import { Portal } from "../../../portal/Portal";
import { AccountDrawer } from "../../../wallet2/accountDrawer";
import { useAccount } from "../../../../hooks";
import { CheckCircle, Power } from "phosphor-react";
import { useDisconnect } from "../../../../hooks/connection/useDisconnect";
import { useIsRobloxLoggedIn } from "../../../../hooks/roblox/useIsRobloxLoggedIn";
import { useRobloxLogout } from "../../../../hooks/roblox/useRobloxLogout";

const Wrapper = styled(Grid)`
  container-type: inline-size;
  display: flex;
  flex-direction: row;
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
  background-color: white;
`;
const CardTitle = styled(Typography)``;
const StepWrapperGrid = styled(Grid)<{
  $theme: ConnectRobloxProps["theme"];
  $isActive: StepProps["isActive"];
  $isDone: StepProps["isDone"];
  $name: StepProps["name"];
  $itemWidthPx: number;
}>`
  max-width: 22.125rem;
  background-color: white;
  svg {
    ${({ $name, $theme, $isActive }) => {
      if ($name === "roblox") {
        return css`
          path:first-child {
            fill: ${$isActive
              ? $theme.robloxCard.number.active.backgroundColor
              : $theme.robloxCard.number.inactive.backgroundColor};
          }
          path:last-child {
            stroke: ${$isActive
              ? $theme.robloxCard.number.active.stroke
              : $theme.robloxCard.number.inactive.stroke};
          }
        `;
      }
      if ($name === "wallet") {
        return css`
          path:first-child {
            fill: ${$isActive
              ? $theme.walletCard.number.active.backgroundColor
              : $theme.walletCard.number.inactive.backgroundColor};
          }
          path:last-child {
            stroke: ${$isActive
              ? $theme.walletCard.number.active.stroke
              : $theme.walletCard.number.inactive.stroke};
          }
        `;
      }
      if ($name === "signup") {
        return css`
          path:first-child {
            fill: ${$isActive
              ? $theme.signUpCard.number.active.backgroundColor
              : $theme.signUpCard.number.inactive.backgroundColor};
          }
          path:last-child {
            stroke: ${$isActive
              ? $theme.signUpCard.number.active.stroke
              : $theme.signUpCard.number.inactive.stroke};
          }
        `;
      }
      return "";
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
      background-color: #f1f3f9;
    }
  }
  @container (width < 692px) {
    ${CardTitle} {
      min-height: 45px;
    }
  }
`;

type StepProps = Pick<ConnectRobloxProps, "theme"> & {
  itemTheme: CardThemeProps;
  icon: ReactElement;
  title: string;
  subtitle: string;
  isActive: boolean;
  isDone: boolean;
  button: ReactElement;
  name: "roblox" | "wallet" | "signup";
};
const Step = ({
  icon: Icon,
  title,
  subtitle,
  isActive,
  isDone,
  theme,
  name,
  itemTheme,
  button: Button
}: StepProps) => {
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
      ref={itemRef}
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      $theme={theme}
      $isActive={isActive}
      $isDone={isDone}
      $itemWidthPx={itemWidthPx}
      $name={name}
    >
      <IconWrapper>
        {isDone ? (
          <CheckCircle size={41} color={itemTheme.check.color} />
        ) : (
          Icon
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
        color={itemTheme.subtitle.color}
        textAlign="center"
        // @ts-expect-error textWrap is supported by browser
        style={{ textWrap: "pretty", flexGrow: 1 }}
      >
        {subtitle}
      </Typography>
      {Button}
    </StepWrapperGrid>
  );
};

type CardThemeProps = {
  subtitle: {
    color: CSSProperties["color"];
  };
  check: {
    color: CSSProperties["color"];
  };
  number: {
    active: {
      backgroundColor: CSSProperties["color"];
      stroke: CSSProperties["color"];
    };
    inactive: {
      backgroundColor: CSSProperties["color"];
      stroke: CSSProperties["color"];
    };
  };
  button: {
    active: Omit<BaseButtonTheme, "color" | "background"> &
      Required<Pick<BaseButtonTheme, "color" | "background">>;
    inactive: Omit<BaseButtonTheme, "color" | "background"> &
      Required<Pick<BaseButtonTheme, "color" | "background">>;
  };
};
export type ConnectRobloxProps = {
  brand: string;
  theme: {
    robloxCard: CardThemeProps;
    walletCard: CardThemeProps;
    signUpCard: CardThemeProps;
  };
};

const backendOrigin = "http://localhost:3333";
type ActiveStep = 0 | 1 | 2;
export const ConnectRoblox = ({ brand, theme }: ConnectRobloxProps) => {
  const { address } = useAccount();
  const disconnect = useDisconnect();
  const [isSignUpDone, setSignUpDone] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<ActiveStep>(0);
  const { data: robloxLoggedInData, refetch: getIsRobloxLoggedInAsync } =
    useIsRobloxLoggedIn({
      origin: backendOrigin,
      options: {
        enabled: true
      }
    });
  const { mutateAsync: robloxLogoutAsync } = useRobloxLogout({
    origin: backendOrigin
  });

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
    <Wrapper justifyContent="center" gap="1.5rem">
      <Step
        name="roblox"
        theme={theme}
        itemTheme={theme.robloxCard}
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
            <BaseButton
              theme={theme.robloxCard.button.inactive}
              onClick={async () => {
                await robloxLogoutAsync();
              }}
            >
              Logout Roblox <StyledPower size={20} />
            </BaseButton>
          ) : (
            <BaseButton
              theme={theme.robloxCard.button.active}
              onClick={() => {
                window.open(`${backendOrigin}/login`, "_blank");
                const id = setInterval(async () => {
                  try {
                    const { data } = await getIsRobloxLoggedInAsync();
                    if (data) {
                      const { isLoggedIn } = data;
                      if (isLoggedIn) {
                        clearInterval(id); // stop polling once the user is logged in
                        nextLatestActiveStep(1);
                        return;
                      }
                    }
                  } catch (error) {
                    clearInterval(id); // something went wrong, stop polling
                  }
                }, 1000);
              }}
            >
              Login with Roblox
            </BaseButton>
          )
        }
      />
      <Step
        name="wallet"
        theme={theme}
        itemTheme={theme.walletCard}
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
          <>
            {address ? (
              <BaseButton
                theme={theme.walletCard.button.inactive}
                onClick={() => disconnect({ isUserDisconnecting: true })}
              >
                Disconnect Account <StyledPower size={20} />
              </BaseButton>
            ) : (
              <ConnectWallet
                connectWalletButtonDisabled={!isConnectWalletStepActive}
                connectWalletButtonTheme={theme.walletCard.button.active}
                connectedButtonTheme={theme.walletCard.button.active}
                errorButtonTheme={theme.walletCard.button.active}
                connectWalletChild="Connect Account"
              />
            )}
            <Portal>
              <AccountDrawer
                backgroundColor="white"
                buyCryptoTheme={theme.walletCard.button.active}
                disconnectBorderRadius={
                  theme.walletCard.button.active.borderRadius
                }
                disconnectBackgroundColor={
                  theme.walletCard.button.active.background
                }
                disconnectColor={theme.walletCard.button.active.color}
                walletModalProps={{
                  withMagicLogin: true,
                  optionProps: {
                    backgroundColor: theme.walletCard.button.active.background,
                    color: theme.walletCard.button.active.color,
                    borderRadius: theme.walletCard.button.active.borderRadius,
                    iconBorderRadius:
                      theme.walletCard.button.active.borderRadius,
                    hoverFocusBackgroundColor:
                      theme.walletCard.button.active.hover?.background,
                    hoverColor: theme.walletCard.button.active.hover?.color
                  },
                  magicLoginButtonProps: {
                    buttonProps: {
                      theme: theme.walletCard.button.active
                    }
                  },
                  connectionErrorProps: {
                    tryAgainTheme: theme.walletCard.button.active,
                    backToWalletSelectionTheme: theme.walletCard.button.active
                  },
                  PrivacyPolicy: () => (
                    <Typography
                      style={{ color: "rgb(9, 24, 44)", fontSize: "0.75rem" }}
                      display="block"
                    >
                      By connecting a wallet, you agree to Boson App 's{" "}
                      <a
                        href="https://bosonapp.io/#/terms-and-conditions"
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{ fontSize: "inherit" }}
                      >
                        Terms & Conditions
                      </a>{" "}
                      and consent to its{" "}
                      <a
                        href="https://bosonapp.io/#/privacy-policy"
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{ fontSize: "inherit" }}
                      >
                        Privacy Policy
                      </a>
                      . (Last Updated 18 August 2023)
                    </Typography>
                  )
                }}
              />
            </Portal>
          </>
        }
      />
      <Step
        name="signup"
        theme={theme}
        itemTheme={theme.signUpCard}
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
        title="Get access to exclusives!"
        subtitle={`Now you can purchase ${brand} exclusives that are available to you.`}
        button={
          <BaseButton
            theme={theme.signUpCard.button.inactive}
            disabled={activeStep !== 2}
            onClick={() => {
              setSignUpDone(true);
              // TODO: what to do here?
            }}
          >
            Sign up
          </BaseButton>
        }
      />
    </Wrapper>
  );
};
