import styled from "styled-components";
import { colors } from "../../lib/colors";
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
  border: 2px solid ${colors.concreteGray};
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: ${zIndex.stageIndicator};
  color: black;
`;

const BaseLine = styled.div<{ stage: Props["stage"] }>`
  height: 16px;
  width: 240px;
  background: rgb(15, 251, 173);
  background: linear-gradient(
    ${(p) => (p.stage === 1 ? "90deg" : "270deg")},
    rgba(15, 251, 173, 1) 0%,
    rgba(200, 200, 200, 1) 60%,
    rgba(193, 193, 193, 1) 100%
  );
  border: 2px solid ${colors.concreteGray};
`;

const Line1 = styled(BaseLine)<{ stage: Props["stage"] }>`
  background: ${(p) => {
    if (p.stage === 3) {
      return "rgba(193, 193, 193, 1)";
    }
    return `linear-gradient(
      ${p.stage === 1 ? "90deg" : "270deg"},
    rgba(15, 251, 173, 1) 0%,
    rgba(200, 200, 200, 1) 60%,
    rgba(193, 193, 193, 1) 100%
    )`;
  }};
`;

const Line2 = styled(BaseLine)<{ stage: Props["stage"] }>`
  background: ${(p) => {
    if (p.stage === 1) {
      return "rgba(193, 193, 193, 1)";
    }
    return `linear-gradient(
      ${p.stage === 2 ? "90deg" : "270deg"},
    rgba(15, 251, 173, 1) 0%,
    rgba(200, 200, 200, 1) 60%,
    rgba(193, 193, 193, 1) 100%
    )`;
  }};
`;

interface Props {
  stage: number;
}

export function StageIndicator({ stage }: Props) {
  return (
    <Root>
      <StagePoint
        style={{
          backgroundColor: stage === 1 ? colors.neonGreen : colors.stoneWallGray
        }}
      >
        1
      </StagePoint>
      <Line1 stage={stage} />
      <StagePoint
        style={{
          backgroundColor: stage === 2 ? colors.neonGreen : colors.stoneWallGray
        }}
      >
        2
      </StagePoint>
      <Line2 stage={stage} />
      <StagePoint
        style={{
          backgroundColor: stage === 3 ? colors.neonGreen : colors.stoneWallGray
        }}
      >
        3
      </StagePoint>
    </Root>
  );
}
