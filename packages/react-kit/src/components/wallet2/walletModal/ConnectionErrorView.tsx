import React from "react";
import { Warning } from "phosphor-react";
import styled from "styled-components";

import { Typography } from "../../ui/Typography";
import { useCloseAccountDrawer } from "../accountDrawer";
import { flexColumnNoWrap } from "../styles";
import {
  ActivationStatus,
  useActivationState
} from "../../connection/activate";
import { colors } from "../../../theme";
import { Grid } from "../../ui/Grid";
import { BaseButton, BaseButtonProps } from "../../buttons/BaseButton";

const Wrapper = styled.div`
  ${flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const AlertTriangleIcon = styled(Warning)`
  width: 90px;
  height: 90px;
  stroke-width: 1;
  margin: 36px;
  color: ${colors.red};
`;

export type ConnectionErrorViewProps = {
  tryAgainTheme: BaseButtonProps["theme"];
  backToWalletSelectionTheme: BaseButtonProps["theme"];
};
// TODO(cartcrom): move this to a top level modal, rather than inline in the drawer
export default function ConnectionErrorView({
  tryAgainTheme,
  backToWalletSelectionTheme
}: ConnectionErrorViewProps) {
  const { activationState, tryActivation, cancelActivation } =
    useActivationState();
  const closeDrawer = useCloseAccountDrawer();

  if (activationState.status !== ActivationStatus.ERROR) return null;

  const retry = () => tryActivation(activationState.connection, closeDrawer);

  return (
    <Wrapper>
      <AlertTriangleIcon />
      <Typography marginBottom="8px">Error connecting</Typography>
      <Typography
        fontSize={16}
        marginBottom={24}
        lineHeight="24px"
        textAlign="center"
      >
        The connection attempt failed. Please click try again and follow the
        steps to connect in your wallet.
      </Typography>
      <Grid gap="1rem">
        <BaseButton onClick={retry} theme={tryAgainTheme}>
          Try Again
        </BaseButton>
        <BaseButton
          onClick={cancelActivation}
          theme={backToWalletSelectionTheme}
        >
          <Typography marginBottom={12}>Back to wallet selection</Typography>
        </BaseButton>
      </Grid>
    </Wrapper>
  );
}
