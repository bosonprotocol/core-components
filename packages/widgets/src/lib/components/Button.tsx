import styled from "styled-components";

export const Button = styled.button`
  all: unset;
  user-select: none;
  width: 200px;
  background-color: #0ffbad;
  color: #000000;
  border: 2px solid #5e5e5e;
  padding: 8px 16px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.9;

  ${(p) =>
    p.disabled &&
    `
    background-color: #c1c1c1;
    cursor: initial;
    opacity: 0.7;
  `}
`;
