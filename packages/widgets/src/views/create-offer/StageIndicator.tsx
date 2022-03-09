import styled from "styled-components";
import { zIndex } from "../../lib/zIndex";

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;

const StagePoint = styled.div`
  height: 24px;
  width: 24px;
  margin-left: -12px;
  margin-right: -12px;
  border-radius: 20px;
  background-color: red;
  border: 2px solid #5e5e5e;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: ${zIndex.stageIndicator};
  color: #333333;
`;

const Line = styled.div`
  height: 16px;
  width: 240px;
  background: rgb(15, 251, 173);
  background: linear-gradient(
    90deg,
    rgba(15, 251, 173, 1) 0%,
    rgba(227, 250, 227, 1) 44%,
    rgba(223, 227, 232, 1) 100%
  );
  border: 2px solid #5e5e5e;
`;

interface Props {
  stage: 1 | 2;
}

export function StageIndicator({ stage }: Props) {
  return (
    <Root>
      <StagePoint
        style={{ backgroundColor: stage === 1 ? "#0ffbad" : "#dfe3e8" }}
      >
        1
      </StagePoint>
      <Line />
      <StagePoint
        style={{ backgroundColor: stage === 2 ? "#0ffbad" : "#dfe3e8" }}
      >
        2
      </StagePoint>
    </Root>
  );
}
