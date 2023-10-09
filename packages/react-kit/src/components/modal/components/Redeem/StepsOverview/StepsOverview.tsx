import React, { useEffect } from "react";
import styled from "styled-components";

import { theme } from "../../../../../theme";
import { Button } from "../../../../buttons/Button";
import Grid from "../../../../ui/Grid";
import { CommitStep } from "./style";
import Step from "../../../../ui/Step";
import { breakpoint } from "../../../../../lib/ui/breakpoint";
import { useNonModalContext } from "../../../nonModal/NonModal";
import Typography from "../../../../ui/Typography";

const colors = theme.colors.light;
const CommitStepWrapper = styled.div`
  overflow: hidden;
  margin: 1rem 0;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: space-between;

  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-row-gap: 1rem;
  grid-column-gap: 1rem;
  ${breakpoint.m} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  svg {
    fill: var(--secondary);
  }
`;
const StyledCommitStepWrapper = styled(CommitStepWrapper)`
  [data-testid="step-title"] {
    font-size: 1rem;
  }
  [data-step] {
    color: ${colors.accent};
    &:after {
      background: ${colors.primary};
    }
  }
`;

interface Props {
  onNextClick: () => void;
}

export default function StepsOverview({ onNextClick }: Props) {
  const dispatch = useNonModalContext();
  useEffect(() => {
    dispatch({
      payload: {
        headerComponent: (
          <Typography tag="h3" $width="100%">
            Redeem your item
          </Typography>
        )
      }
    });
  }, [dispatch]);

  return (
    <>
      <StyledCommitStepWrapper>
        <CommitStep>
          <Step number={1} title="Provide your address">
            This is where your item will be shipped, so make sure to double
            check that it is correct
          </Step>
        </CommitStep>
        <CommitStep>
          <Step number={2} title="Sign the transaction">
            This verifies that you are the rightful owner of the rNFT and
            authorizes the redemption process
          </Step>
        </CommitStep>
        <CommitStep>
          <Step number={3} title="Your rNFT gets burned">
            This step completes the process and makes sure the rNFT can't be
            used for redemption again.
          </Step>
        </CommitStep>
        <CommitStep>
          <Step number={4} title="Your item will be shipped">
            Your item will be shipped to the address provided.You will receive
            an email about the shipment.
          </Step>
        </CommitStep>
      </StyledCommitStepWrapper>
      <Grid padding="2rem 0 0 0" justifyContent="space-between">
        <Button variant="primaryFill" onClick={() => onNextClick()}>
          Next
        </Button>
      </Grid>
    </>
  );
}
