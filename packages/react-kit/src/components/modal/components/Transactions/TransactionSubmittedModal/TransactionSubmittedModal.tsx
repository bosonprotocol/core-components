import React from "react";
import { ArrowCircleUp } from "phosphor-react";
import { useEffect } from "react";
import styled from "styled-components";

import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import { GenericModalProps } from "../../../ModalContext";
import { useModal } from "../../../useModal";
import { colors } from "../../../../../theme";
import { Button } from "../../../../buttons/Button";
import { useCoreSDKWithContext } from "../../../../../hooks/core-sdk/useCoreSdkWithContext";

const StyledArrowCircleUp = styled(ArrowCircleUp)`
  * {
    stroke-width: 2px;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

interface Props {
  action: string;
  txHash: string;
}
export default function TransactionSubmittedModal({ action, txHash }: Props) {
  const { updateProps, store, hideModal } = useModal();
  const coreSDK = useCoreSDKWithContext();
  useEffect(() => {
    updateProps<"TRANSACTION_SUBMITTED">({
      ...store,
      modalProps: {
        ...(store.modalProps as GenericModalProps<"TRANSACTION_SUBMITTED">)
      },
      modalSize: "auto",
      modalMaxWidth: {
        xs: "550px"
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
    >
      <StyledArrowCircleUp size={128} color={colors.green} />

      <Typography fontWeight="600" fontSize="1.5rem" lineHeight="150%">
        {action} transaction submitted
      </Typography>
      <a
        href={coreSDK.getTxExplorerUrl?.(txHash)}
        target="_blank"
        rel="noreferrer"
      >
        <Typography
          fontWeight="600"
          fontSize="1rem"
          lineHeight="150%"
          margin="0.5rem 0 1.5rem 0"
          color={colors.violet}
        >
          View on Explorer
        </Typography>
      </a>

      <StyledButton onClick={hideModal}>Close</StyledButton>
    </Grid>
  );
}
