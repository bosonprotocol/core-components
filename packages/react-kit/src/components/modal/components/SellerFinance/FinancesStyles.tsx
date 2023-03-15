import React from "react";
import styled from "styled-components";
import { theme } from "../../../../theme";

import Grid from "../../../ui/Grid";
const colors = theme.colors.light;
export const ProtocolStrong = styled.strong`
  margin-right: 0.25rem;
`;

export const InputWrapper = styled(Grid)<{ $hasError?: boolean }>`
  flex: 1;
  gap: 1rem;

  margin-top: -1rem;
  padding: 1.125rem 1rem;
  max-height: 3.5rem;
  background: ${colors.darkGrey};
  ${({ $hasError }) =>
    $hasError &&
    `
    border: 0.0625rem solid ${colors.red};
    `}
`;

export const Input = styled.input`
  background: transparent;
  border: none;
  flex: 1;

  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  color: ${colors.white};
  &:focus {
    outline: none;
  }
`;

export const AmountWrapper = styled.div`
  width: 100%;
`;
