import styled from "styled-components";

import { colors } from "../../colors";

export const columnGap = 24;

export const Value = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border: 2px solid ${colors.shadowGray};
  background-color: ${colors.cyberSpaceGray};
  color: ${colors.satinWhite};
  border-radius: 4px;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

export const Money = styled.div`
  display: flex;
  flex-grow: 1;
  min-width: 0;

  ${Value} {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-right: none;
  }
`;

export const Currency = styled.div`
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border: 2px solid ${colors.shadowGray};
  background-color: ${colors.concreteGray};
  color: ${colors.satinWhite};
  padding: 4px;
`;

export const Row = styled.div`
  display: flex;
  gap: ${columnGap}px;
  min-width: 0;
`;

export const Entry = styled.div`
  flex-grow: 1;
  max-width: calc(50% - ${columnGap / 2}px);
  display: inline-flex;
  align-items: center;
  vertical-align: top;
  margin-bottom: 10px;
`;

export const Label = styled.div`
  font-weight: 500;
  display: inline-block;
  min-width: 140px;
  padding-right: 8px;
  font-size: 14px;
  user-select: none;
`;

export const Spacer = styled.div`
  height: 20px;
`;
