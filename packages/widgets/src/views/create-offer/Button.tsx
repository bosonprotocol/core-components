import styled from "styled-components";

export const Button = styled.button`
  all: unset;
  user-select: none;
  width: 200px;
  background-color: #0ffbad;
  color: #333333;
  border: 2px solid #5e5e5e;
  padding: 8px 16px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;

  ${(p) =>
    p.disabled &&
    `
    background-color: #ced4db;
    cursor: initial;
  `}
`;
