import { WarningCircle } from "phosphor-react";
import React, { useEffect } from "react";

import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";
import { useModal } from "../../../useModal";
import { theme } from "../../../../../theme";
import { GenericModalProps } from "../../../ModalContext";
const colors = theme.colors.light;
export default function TransactionFailedModal({
  errorMessage,
  detailedErrorMessage
}: {
  errorMessage: string;
  detailedErrorMessage?: string;
}) {
  const { updateProps, store } = useModal();
  useEffect(() => {
    updateProps<"TRANSACTION_FAILED">({
      ...store,
      modalProps: {
        ...store.modalProps
      } as GenericModalProps<"TRANSACTION_FAILED">,
      modalSize: "auto",
      modalMaxWidth: {
        xs: "550px"
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Grid flexDirection="column" alignItems="center">
      <WarningCircle size={128} color={colors.orange} />

      <Typography fontWeight="600" $fontSize="1.5rem" lineHeight="150%">
        {errorMessage || "Confirmation Failed"}
      </Typography>
      <Typography
        fontWeight="400"
        $fontSize="1rem"
        lineHeight="150%"
        margin="0.5rem 0 1.5rem 0"
      >
        {detailedErrorMessage || "Please retry this action"}
      </Typography>
    </Grid>
  );
}
