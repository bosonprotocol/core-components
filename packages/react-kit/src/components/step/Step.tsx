import { CSSProperties } from "styled-components";
import { StepStyle } from "./Step.styles";
import React from "react";

export enum StepState {
  Inactive = "inactive",
  Active = "active",
  Done = "done"
}

export type StepColorProps = {
  stepInactiveDotColor?: CSSProperties["color"];
  stepInactiveBackgroundColor?: CSSProperties["color"];
  stepInactiveHoverDotColor?: CSSProperties["color"];
  stepInactiveHoverBackgroundColor?: CSSProperties["color"];
  stepActiveBackgroundColor?: CSSProperties["color"];
  stepActiveDotsColor?: CSSProperties["color"];
  stepDoneBackgroundColor?: CSSProperties["color"];
  stepDoneCheckColor?: CSSProperties["color"];
  stepDoneHoverBackgroundColor?: CSSProperties["color"];
  stepDoneHoverCheckColor?: CSSProperties["color"];
};

type StepProps = StepColorProps & {
  className?: string;
  onClick?: () => void;
  state?: StepState;
  disabled?: boolean;
};

export function Step({
  state = StepState.Inactive,
  className,
  disabled,
  onClick,
  stepInactiveDotColor,
  stepInactiveBackgroundColor,
  stepInactiveHoverDotColor,
  stepInactiveHoverBackgroundColor,
  stepActiveBackgroundColor,
  stepActiveDotsColor,
  stepDoneBackgroundColor,
  stepDoneCheckColor,
  stepDoneHoverBackgroundColor,
  stepDoneHoverCheckColor,
  ...props
}: StepProps) {
  return (
    <StepStyle
      $state={state}
      {...props}
      $stepInactiveDotColor={stepInactiveDotColor}
      $stepInactiveBackgroundColor={stepInactiveBackgroundColor}
      $stepInactiveHoverDotColor={stepInactiveHoverDotColor}
      $stepInactiveHoverBackgroundColor={stepInactiveHoverBackgroundColor}
      $stepActiveBackgroundColor={stepActiveBackgroundColor}
      $stepActiveDotsColor={stepActiveDotsColor}
      $stepDoneBackgroundColor={stepDoneBackgroundColor}
      $stepDoneCheckColor={stepDoneCheckColor}
      $stepDoneHoverBackgroundColor={stepDoneHoverBackgroundColor}
      $stepDoneHoverCheckColor={stepDoneHoverCheckColor}
      disabled={!!disabled}
    >
      <div />
    </StepStyle>
  );
}
