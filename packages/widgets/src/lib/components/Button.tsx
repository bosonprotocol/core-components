import styled from "styled-components";
import { colors } from "../colors";

export const Button = styled.button`
  all: unset;
  user-select: none;
  width: 200px;
  background-color: ${colors.neonGreen};
  color: black;
  border: 2px solid ${colors.concreteGray};
  padding: 8px 16px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.9;

  ${(p) =>
    p.disabled &&
    `
    background-color: ${colors.stoneWallGray};
    cursor: initial;
    opacity: 0.7;
  `}
`;
