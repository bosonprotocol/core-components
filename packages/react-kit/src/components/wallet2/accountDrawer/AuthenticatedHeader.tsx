import {
  ArrowDownRight,
  ArrowUpRight,
  Copy,
  CreditCard,
  IconProps,
  Info,
  SignOut
} from "phosphor-react";
import React, { useCallback, useState } from "react";
import styled, { CSSProperties } from "styled-components";
import { Typography } from "../../ui/Typography";
import StatusIcon from "../identicon/StatusIcon";
import { FiatLink, useFiatLinkContext } from "./fiatOnrampModal/FiatLink";
// import FiatOnrampModal from "./fiatOnrampModal";
import { IconWithConfirmTextButton } from "./IconButton";
import MiniPortfolio, { MiniPortfolioProps } from "./miniPortfolio";
import { Column } from "../../ui/column";
import { colors } from "../../../theme";
import { useENSName } from "../../../hooks/ens/useENSName";
import { useDisconnect } from "../../../hooks/connection/useDisconnect";
import { formatAddress } from "../../../lib/address/address";
import { CopyButton } from "../../form/Field.styles";
import { Spinner } from "../../ui/loading/Spinner";
import { Tooltip } from "../../tooltip/Tooltip";
import { copyToClipboard } from "../../../lib/copy/copyToClipboard";
import {
  getConnection,
  useConnections
} from "../../connection/ConnectionsProvider";
import { useWeb3React } from "@web3-react/core";
import { BaseButton, BaseButtonTheme } from "../../buttons/BaseButton";

const AuthenticatedHeaderWrapper = styled.div`
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const IconHoverText = styled.span`
  color: ${colors.white};
  position: absolute;
  top: 28px;
  border-radius: 8px;
  transform: translateX(-50%);
  opacity: 0;
  font-size: 0.75rem;
  padding: 5px;
  left: 10px;
`;
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  & > a,
  & > button {
    margin-right: 8px;
  }

  & > button:last-child {
    margin-right: 0px;
    ${IconHoverText}:last-child {
      left: 0px;
    }
  }
`;
const FiatOnrampNotAvailableText = styled(Typography)`
  align-items: center;
  display: flex;
  justify-content: center;
`;
const FiatOnrampAvailabilityExternalLink = styled.a`
  align-items: center;
  display: flex;
  height: 14px;
  justify-content: center;
  margin-left: 6px;
  width: 14px;
`;

const StatusWrapper = styled.div`
  display: inline-block;
  width: 70%;
  max-width: 70%;
  padding-right: 8px;
  display: inline-flex;
`;

const AccountNamesWrapper = styled.div`
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`;

const StyledInfoIcon = styled(Info)`
  height: 12px;
  width: 12px;
  flex: 1 1 auto;
`;

const HeaderWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const PortfolioDrawerContainer = styled(Column)`
  flex: 1;
`;

const StyledIconWithConfirmTextButton = styled(IconWithConfirmTextButton)`
  * {
    font-size: 0.7rem;
  }
`;

export function PortfolioArrow({
  change,
  ...rest
}: { change: number } & IconProps) {
  return change < 0 ? (
    <ArrowDownRight size={20} {...rest} />
  ) : (
    <ArrowUpRight size={20} {...rest} />
  );
}
export type AuthenticatedHeaderProps = MiniPortfolioProps & {
  onUserDisconnect?: () => unknown;
  disconnectColor: CSSProperties["color"];
  disconnectBackgroundColor: CSSProperties["backgroundColor"];
  disconnectBorderRadius: CSSProperties["borderRadius"];
  buyCryptoTheme: BaseButtonTheme;
};
export function AuthenticatedHeader({
  account,
  onUserDisconnect,
  disconnectColor,
  disconnectBackgroundColor,
  disconnectBorderRadius,
  buyCryptoTheme,
  defaultTokens
}: AuthenticatedHeaderProps) {
  const { connector } = useWeb3React();
  const { ENSName } = useENSName(account);
  const connection = getConnection(connector, useConnections());

  const disconnect = useDisconnect();

  // const toggleWalletDrawer = useToggleAccountDrawer();

  // const openFiatOnrampModal = useOpenModal(ApplicationModal.FIAT_ONRAMP);
  // const openFoRModal = useCallback(() => {
  //   toggleWalletDrawer();
  //   openFiatOnrampModal();

  // }, [toggleWalletDrawer, openFiatOnrampModal]);

  // const [shouldCheck, setShouldCheck] = useState(false);
  // const {
  //   available: fiatOnrampAvailable,
  //   availabilityChecked: fiatOnrampAvailabilityChecked,
  //   error,
  //   loading: fiatOnrampAvailabilityLoading
  // } = useFiatOnrampAvailability(shouldCheck, openFoRModal);

  // const handleBuyCryptoClick = useCallback(() => {
  //   if (!fiatOnrampAvailabilityChecked) {
  //     setShouldCheck(true);
  //   } else if (fiatOnrampAvailable) {
  //     openFoRModal();
  //   }
  // }, [fiatOnrampAvailabilityChecked, fiatOnrampAvailable, openFoRModal]);
  // const disableBuyCryptoButton = Boolean(
  //   error ||
  //     (!fiatOnrampAvailable && fiatOnrampAvailabilityChecked) ||
  //     fiatOnrampAvailabilityLoading
  // );
  const error = false;
  const fiatOnrampAvailabilityLoading = false;
  const fiatOnrampAvailable = true;
  const fiatOnrampAvailabilityChecked = false;
  const [showFiatOnrampUnavailableTooltip, setShow] = useState<boolean>(false);
  const openFiatOnrampUnavailableTooltip = useCallback(
    () => setShow(true),
    [setShow]
  );
  const closeFiatOnrampUnavailableTooltip = useCallback(
    () => setShow(false),
    [setShow]
  );

  const { isFiatLoading } = useFiatLinkContext();
  return (
    <AuthenticatedHeaderWrapper>
      {/* 
       TODO: uncomment when we create a moonpay account
      <FiatOnrampModal /> */}
      <HeaderWrapper>
        <StatusWrapper>
          <StatusIcon account={account} connection={connection} size={40} />
          {account && (
            <AccountNamesWrapper>
              <Typography gap="0.5rem">
                {ENSName ?? formatAddress(account)}
                <CopyButton
                  onClick={async () => {
                    await copyToClipboard(ENSName ?? account);
                  }}
                >
                  <Copy size={14} />
                </CopyButton>
              </Typography>
              {/* Displays smaller view of account if ENS name was rendered above */}
              {ENSName && (
                <Typography>
                  {formatAddress(account)}
                  <CopyButton
                    onClick={async () => {
                      await copyToClipboard(account);
                    }}
                  >
                    <Copy size={14} />
                  </CopyButton>
                </Typography>
              )}
            </AccountNamesWrapper>
          )}
        </StatusWrapper>
        <IconContainer>
          <StyledIconWithConfirmTextButton
            data-testid="wallet-disconnect"
            onConfirm={() =>
              disconnect({ isUserDisconnecting: true, onUserDisconnect })
            }
            Icon={SignOut}
            text="Disconnect"
            dismissOnHoverOut
            color={disconnectColor}
            backgroundColor={disconnectBackgroundColor}
            borderRadius={disconnectBorderRadius}
          />
        </IconContainer>
      </HeaderWrapper>
      <PortfolioDrawerContainer>
        <FiatLink>
          <BaseButton
            fill
            theme={buyCryptoTheme}
            // onClick={handleBuyCryptoClick}
            // disabled={disableBuyCryptoButton}
            disabled={isFiatLoading}
            data-testid="wallet-buy-crypto"
          >
            {error ? (
              <Typography>{error}</Typography>
            ) : (
              <>
                {fiatOnrampAvailabilityLoading || isFiatLoading ? (
                  <Spinner size={20} />
                ) : (
                  <CreditCard height="20px" width="20px" />
                )}{" "}
                Buy crypto
              </>
            )}
          </BaseButton>
        </FiatLink>
        {Boolean(!fiatOnrampAvailable && fiatOnrampAvailabilityChecked) && (
          <FiatOnrampNotAvailableText marginTop="8px">
            Not available in your region
            <Tooltip
              disabled={!showFiatOnrampUnavailableTooltip}
              content={
                "Moonpay is not available in some regions. Click to learn more."
              }
            >
              <FiatOnrampAvailabilityExternalLink
                onMouseEnter={openFiatOnrampUnavailableTooltip}
                onMouseLeave={closeFiatOnrampUnavailableTooltip}
                style={{ color: "inherit" }}
                href="https://support.uniswap.org/hc/en-us/articles/11306664890381-Why-isn-t-MoonPay-available-in-my-region-"
              >
                <StyledInfoIcon />
              </FiatOnrampAvailabilityExternalLink>
            </Tooltip>
          </FiatOnrampNotAvailableText>
        )}
        <MiniPortfolio account={account} defaultTokens={defaultTokens} />
      </PortfolioDrawerContainer>
    </AuthenticatedHeaderWrapper>
  );
}
