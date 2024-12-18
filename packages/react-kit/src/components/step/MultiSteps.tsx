import { ArrowLeft, ArrowRight } from "phosphor-react";
import React, { useEffect, useRef, useState } from "react";

import { Grid } from "../ui/Grid";
import { Step, StepColorProps, StepState } from "./Step";
import { MultiStepStyle, MultiStepWrapper, StepWrapper } from "./Step.styles";
import { useBreakpoints } from "../../hooks/useBreakpoints";
import { CSSProperties } from "styled-components";
import { colors } from "../../theme";

type StepData = {
  name?: string;
  steps: number;
};

export type MultiStepsProps = {
  disableInactiveSteps?: boolean;
  active?: number;
  data: Array<StepData> | Readonly<Array<StepData>>;
  callback?: (cur: number) => void;
  isRightArrowEnabled?: boolean;
  enabledArrowColor?: CSSProperties["color"];
  disabledArrowColor?: CSSProperties["color"];
  hideArrows?: boolean;
} & StepColorProps;
const dataStepsWrapper = "data-steps-wrapper";
export function MultiSteps({
  data,
  active,
  callback,
  disableInactiveSteps = false,
  isRightArrowEnabled = false,
  hideArrows = false,
  enabledArrowColor = colors.greyDark,
  disabledArrowColor = colors.greyLight2,
  stepInactiveDotColor = "#d3d5db",
  stepInactiveBackgroundColor = colors.white,
  stepInactiveHoverDotColor = colors.greyDark,
  stepInactiveHoverBackgroundColor = colors.greyLight,
  stepActiveBackgroundColor = colors.black,
  stepActiveDotsColor = colors.green, // TODO: var(--primary) in boson Dapp
  stepDoneBackgroundColor = colors.green, // TODO: var(--primary) in boson Dapp
  stepDoneCheckColor = colors.black,
  stepDoneHoverBackgroundColor = colors.black,
  stepDoneHoverCheckColor = colors.green, // TODO: var(--primary) in boson Dapp
  ...props
}: MultiStepsProps) {
  const [current, setCurrent] = useState<number>(active || 0);
  const { isLteS } = useBreakpoints();

  useEffect(() => {
    setCurrent(active || 0);
  }, [active]);
  const stepWidthRef = useRef<number>(50);
  return (
    <Grid
      justifyContent="space-evenly"
      ref={(element) => {
        const children = element?.querySelectorAll(`[${dataStepsWrapper}] > *`);
        children?.forEach((child) => {
          const isVisible = child.checkVisibility({ checkVisibilityCSS: true });
          if (isVisible) {
            if (
              child.clientWidth &&
              stepWidthRef.current !== child.clientWidth
            ) {
              stepWidthRef.current = child.clientWidth;
            }
          }
        });
      }}
    >
      {isLteS && !hideArrows && (
        <Grid alignItems="center" width="auto">
          <ArrowLeft
            size={32}
            style={{ cursor: active && callback ? "pointer" : "not-allowed" }}
            color={active === 0 ? disabledArrowColor : enabledArrowColor}
            onClick={() => {
              if (active && callback) {
                callback(active - 1);
              }
            }}
          />
        </Grid>
      )}
      <div
        style={{
          width: `${stepWidthRef.current}px`
        }}
      />
      <MultiStepStyle
        {...props}
        {...{ [dataStepsWrapper]: true }}
        $isLteS={isLteS}
      >
        {data.map((el, i) => {
          const steps = Array.from(Array(el.steps).keys());
          const newData = data.slice(0, i);
          const previousLength = newData.reduce(
            (acc, cur) => (acc += cur.steps),
            0
          );
          if (
            (isLteS &&
              current >= previousLength &&
              current <= previousLength + steps.length) ||
            !isLteS
          ) {
            return (
              <MultiStepWrapper $isLteS={isLteS} key={`multi_${i}`}>
                <StepWrapper>
                  {steps.map((_: number, key: number) => {
                    const currentKey = previousLength + key;
                    const state =
                      currentKey === current
                        ? StepState.Active
                        : currentKey < current
                          ? StepState.Done
                          : StepState.Inactive;

                    const isStepDisabled =
                      !callback ||
                      (disableInactiveSteps && StepState.Inactive === state);

                    if ((isLteS && active === currentKey) || !isLteS) {
                      return (
                        <Step
                          disabled={isStepDisabled}
                          state={state}
                          onClick={() => {
                            if (!isStepDisabled) {
                              setCurrent(currentKey);
                              callback(currentKey);
                            }
                          }}
                          key={`multi-step_${currentKey}`}
                          stepInactiveDotColor={stepInactiveDotColor}
                          stepInactiveBackgroundColor={
                            stepInactiveBackgroundColor
                          }
                          stepInactiveHoverDotColor={stepInactiveHoverDotColor}
                          stepInactiveHoverBackgroundColor={
                            stepInactiveHoverBackgroundColor
                          }
                          stepActiveBackgroundColor={stepActiveBackgroundColor}
                          stepActiveDotsColor={stepActiveDotsColor}
                          stepDoneBackgroundColor={stepDoneBackgroundColor}
                          stepDoneCheckColor={stepDoneCheckColor}
                          stepDoneHoverBackgroundColor={
                            stepDoneHoverBackgroundColor
                          }
                          stepDoneHoverCheckColor={stepDoneHoverCheckColor}
                        />
                      );
                    }
                    return null;
                  })}
                </StepWrapper>
                <p>{el.name}</p>
              </MultiStepWrapper>
            );
          }
          return null;
        })}
      </MultiStepStyle>
      {isLteS && !hideArrows && (
        <Grid alignItems="flex-end" width="auto">
          <ArrowRight
            size={32}
            color={isRightArrowEnabled ? enabledArrowColor : disabledArrowColor}
            style={{ cursor: isRightArrowEnabled ? "pointer" : "not-allowed" }}
            onClick={() => {
              if (
                isRightArrowEnabled &&
                typeof active === "number" &&
                callback
              ) {
                callback(active + 1);
              }
            }}
          />
        </Grid>
      )}
    </Grid>
  );
}
