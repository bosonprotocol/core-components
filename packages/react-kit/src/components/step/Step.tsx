import React from "react";

import { StepStyle } from "./Step.styles";

export enum StepState {
  Inactive = "inactive",
  Active = "active",
  Done = "done"
}

export interface StepProps {
  className?: string;
  onClick?: () => void;
  state: StepState;
}

export const Step = ({
  className,
  onClick,
  state = StepState.Inactive,
  ...props
}: StepProps) => {
  return (
    <StepStyle className={className} onClick={onClick} state={state} {...props}>
      <div />
    </StepStyle>
  );
};
