import React from "react";

import { Step, StepProps } from "./Step";
import { MultiStepStyle, MultiStepWrapper, StepWrapper } from "./Step.styles";

type StepData = {
  name?: string;
  steps: Array<StepProps>;
};

interface MultiStepsProps {
  data: Array<StepData>;
}

export const MultiSteps = ({ data, ...props }: MultiStepsProps) => {
  return (
    <MultiStepStyle {...props}>
      {data.map((element: StepData, index: number) => (
        <MultiStepWrapper key={`multi_${index}`}>
          <StepWrapper>
            {element.steps.map((step: StepProps, key: number) => (
              <Step {...step} key={`multi-step_${key}`} />
            ))}
          </StepWrapper>
          <p>{element.name}</p>
        </MultiStepWrapper>
      ))}
    </MultiStepStyle>
  );
};
