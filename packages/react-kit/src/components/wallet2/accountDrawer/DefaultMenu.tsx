import React from "react";
import styled from "styled-components";

import { WalletModal, WalletModalProps } from "../walletModal";
import {
  AuthenticatedHeader,
  AuthenticatedHeaderProps
} from "./AuthenticatedHeader";
import { Column } from "../../ui/column";
import { useAccount } from "../../../hooks/connection/connection";

const DefaultMenuWrap = styled(Column)`
  width: 100%;
  height: 100%;
`;

export type DefaultMenuProps = Omit<AuthenticatedHeaderProps, "account"> & {
  walletModalProps: WalletModalProps;
};
export function DefaultMenu({ walletModalProps, ...rest }: DefaultMenuProps) {
  const { address: account } = useAccount();
  const isAuthenticated = !!account;

  return (
    <DefaultMenuWrap>
      {isAuthenticated ? (
        <AuthenticatedHeader {...rest} account={account} />
      ) : (
        <WalletModal {...walletModalProps} />
      )}
    </DefaultMenuWrap>
  );
}
