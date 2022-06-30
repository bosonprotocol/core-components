import styled from "styled-components";
import { colors } from "../../colors";

export const Title = styled.div`
  font-size: 24px;
  text-align: center;
  margin-bottom: 16px;
  color: ${colors.satinWhite};
`;

export const Label = styled.div`
  font-weight: 500;
  font-size: 14px;
  user-select: none;
  margin-bottom: 8px;
  color: ${colors.satinWhite};
`;

export const Value = styled.div`
  padding: 4px 8px;
  border: 2px solid ${colors.stoneWallGray};
  background-color: ${colors.cyberSpaceGray};
  color: ${colors.stoneWallGray};
  border-radius: 4px;
  margin-bottom: 24px;
  font-size: 14px;
`;

export const Center = styled.div`
  gap: 24px;
  display: flex;
  justify-content: center;
`;
