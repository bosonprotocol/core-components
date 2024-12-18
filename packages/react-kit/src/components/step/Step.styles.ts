import styled, { CSSProperties, css } from "styled-components";

import { transition } from "../../components/ui/styles";
import { StepState } from "./Step";
import { theme } from "../../theme";
const colors = theme.colors.light;
type StepColorProps = {
  $stepInactiveDotColor?: CSSProperties["color"];
  $stepInactiveBackgroundColor?: CSSProperties["color"];
  $stepInactiveHoverDotColor?: CSSProperties["color"];
  $stepInactiveHoverBackgroundColor?: CSSProperties["color"];
  $stepActiveBackgroundColor?: CSSProperties["color"];
  $stepActiveDotsColor?: CSSProperties["color"];
  $stepDoneBackgroundColor?: CSSProperties["color"];
  $stepDoneCheckColor?: CSSProperties["color"];
  $stepDoneHoverBackgroundColor?: CSSProperties["color"];
  $stepDoneHoverCheckColor?: CSSProperties["color"];
};
export const StepStyle = styled.div<
  {
    $state: StepState;
    disabled: boolean;
    $isLteS?: boolean;
  } & StepColorProps
>`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-grow: 1;

  min-width: 6rem;
  height: 1.25rem;
  ${({ $state, disabled }) =>
    $state !== StepState.Active &&
    !disabled &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}

  ${({
    $state,
    disabled,
    $stepInactiveBackgroundColor,
    $stepInactiveDotColor,
    $stepInactiveHoverBackgroundColor,
    $stepInactiveHoverDotColor
  }) =>
    $state === StepState.Inactive &&
    css`
      background: ${$stepInactiveBackgroundColor};
      ${transition}

      &:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: ${$stepInactiveDotColor};

        ${transition}

        width: 0.25rem;
        height: 0.25rem;
      }
      ${!disabled &&
      css`
        &:hover {
          background: ${$stepInactiveHoverBackgroundColor};
          &:before {
            background: ${$stepInactiveHoverDotColor};
            width: 0.5rem;
            height: 0.5rem;
          }
        }
      `}

      > div {
        display: none;
      }
    `}

  ${({ $state, $stepActiveBackgroundColor, $stepActiveDotsColor }) =>
    $state === StepState.Active &&
    css`
      background: ${$stepActiveBackgroundColor};

      &:before {
        margin-left: -0.75rem;
      }
      &:after {
        margin-left: 0.75rem;
      }
      > div,
      &:before,
      &:after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        ${transition}
        width: 0.25rem;
        height: 0.25rem;
        border-radius: 50%;
        background: ${$stepActiveDotsColor};
      }
    `}

  ${({
    $state,
    disabled,
    $stepDoneBackgroundColor,
    $stepDoneCheckColor,
    $stepDoneHoverBackgroundColor,
    $stepDoneHoverCheckColor
  }) =>
    $state === StepState.Done &&
    css`
      background: ${$stepDoneBackgroundColor};

      &:before,
      &:after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        ${transition}
        background: ${$stepDoneCheckColor};
      }
      &:before {
        width: 0.35rem;
        height: 0.125rem;
        transform: translate(calc(-50% - 0.35rem), calc(-50% + 0.15rem))
          rotate(-135deg);
      }
      &:after {
        width: 0.75rem;
        height: 0.125rem;
        transform: translate(-50%, -50%) rotate(-45deg);
      }

      > div {
        display: none;
      }
      ${!disabled &&
      css`
        &:hover {
          background: ${$stepDoneHoverBackgroundColor};
          &:before,
          &:after {
            background: ${$stepDoneHoverCheckColor};
          }
        }
      `}
    `}
`;

export const MultiStepStyle = styled.div<{ $isLteS: boolean }>`
  display: flex;
  gap: 1rem;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
  div div {
    display: ${({ $isLteS }) => $isLteS && "none"};
  }

  p {
    text-align: center;
    margin: 0;
    font-weight: 600;
    font-size: 0.75rem;
    line-height: 1.5;
    color: ${colors.greyDark};
  }
`;

export const MultiStepWrapper = styled.div<{ $isLteS: boolean }>`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  position: ${({ $isLteS }) => $isLteS && "absolute"};
  left: ${({ $isLteS }) => $isLteS && "50%"};
  transform: ${({ $isLteS }) => $isLteS && "translate(-50%, 0)"};
`;

export const StepWrapper = styled.div`
  display: flex;
  gap: 0;
  flex-grow: 1;

  flex-direction: row;
  flex-wrap: nowrap;
  border: 1px solid ${colors.border};
  &:empty + p {
    display: none;
  }
  &:empty {
    display: none;
  }
`;
