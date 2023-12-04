import { CheckCircle, X } from "phosphor-react";
import React, { ReactNode } from "react";
import toast, { Toast } from "react-hot-toast";
import styled from "styled-components";

import { theme } from "../../../theme";
import { Button } from "../../buttons/Button";
import Grid from "../../ui/Grid";
const colors = theme.colors.light;

const Close = styled(X)`
  line {
    stroke: ${colors.darkGrey};
  }
`;
const StyledButton = styled(Button)`
  padding: 0 !important;
`;
interface Props {
  t: Toast;
  children: ReactNode;
}

export default function SuccessToast({ t, children }: Props) {
  return (
    <Grid gap="1rem">
      <Grid flexBasis="0">
        <CheckCircle size={40} color={colors.green} />
      </Grid>
      {children}
      <Grid alignSelf="flex-start" justifyContent="flex-end" flexBasis="0">
        <StyledButton
          data-close
          themeVal="blank"
          onClick={() => toast.dismiss(t.id)}
        >
          <Close size={20} />
        </StyledButton>
      </Grid>
    </Grid>
  );
}
