import React, { useEffect } from "react";
import { BigNumber, BigNumberish } from "ethers";
import { AddressZero } from "@ethersproject/constants";

import { useCoreSdk } from "../../../hooks/useCoreSdk";
import { useSignerAddress } from "../../../hooks/useSignerAddress";
import { CtaButtonProps } from "../common/types";
import { CtaButton } from "../common/CtaButton";
import { Action } from "../../../hooks/useCtaClickHandler";

type AdditionalProps = {
  /**
   * ID of offer to commit to.
   */
  offerId: BigNumberish;
  exchangeToken: string;
  price: BigNumberish;
  isPauseCommitting?: boolean;
  onGetSignerAddress?: (
    signerAddress: string | undefined
  ) => string | undefined;
};

type SuccessPayload = {
  exchangeId: BigNumberish;
};

type Props = AdditionalProps & CtaButtonProps<SuccessPayload>;

export const CommitButton = ({
  offerId,
  exchangeToken,
  price,
  isPauseCommitting = false,
  variant = "primaryFill",
  onGetSignerAddress,
  ...restProps
}: Props) => {
  const coreSdk = useCoreSdk(restProps);
  const signerAddress = useSignerAddress(restProps.web3Provider);

  useEffect(() => {
    if (onGetSignerAddress) {
      onGetSignerAddress(signerAddress);
    }
  }, [signerAddress, onGetSignerAddress]);

  const actions: Action[] = [
    // Approve exchange token action
    {
      writeContractFn: () => coreSdk.approveExchangeToken(exchangeToken, price),
      nativeMetaTxContract: exchangeToken,
      signMetaTxFn: () =>
        coreSdk.signNativeMetaTxApproveExchangeToken(exchangeToken, price),
      additionalMetaTxCondition: coreSdk.checkMetaTxConfigSet({
        contractAddress: exchangeToken
      }),
      shouldActionRun: async () => {
        // only approve exchange token if
        // - erc20 token
        // - insufficient allowance of protocol
        if (exchangeToken === AddressZero) {
          return false;
        }
        const currentAllowance = await coreSdk.getProtocolAllowance(
          exchangeToken
        );
        return BigNumber.from(currentAllowance).lt(price);
      }
    },
    // Commit action
    {
      writeContractFn: () => coreSdk.commitToOffer(offerId),
      signMetaTxFn: () =>
        coreSdk.signMetaTxCommitToOffer({
          offerId,
          nonce: Date.now()
        }),
      additionalMetaTxCondition:
        exchangeToken !== AddressZero || BigNumber.from(price).eq(0)
    }
  ];

  return (
    <CtaButton
      variant={variant}
      defaultLabel="Commit"
      successPayload={(receipt) => ({
        exchangeId: coreSdk.getCommittedExchangeIdFromLogs(
          receipt.logs
        ) as string
      })}
      actions={actions}
      {...restProps}
    />
  );
};
