import React, { ReactNode } from "react";
import styled, { css, IntrinsicElementsKeys } from "styled-components";
import { theme } from "../../theme";

import Typography from "../ui/Typography";

const colors = theme.colors.light;

const InfoTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-bottom: 0.25rem;
  > p {
    margin: 0;
  }
`;
const InfoList = styled.ul<{ withCustomMarker?: boolean }>`
  margin: 0 0 0 1.5rem;
  padding: 0;
  line-height: 1.063rem;
  ${({ withCustomMarker }) =>
    withCustomMarker &&
    css`
      margin: unset;
      li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    `}
`;
const InfoListItem = styled.li`
  margin: 0;
  padding: 0;

  p {
    margin: 0;
    color: ${colors.darkGrey};
  }
`;

interface Props {
  policyIcon?: ReactNode;
  titleTag?: IntrinsicElementsKeys;
  bulletPointIcon?: ReactNode;
  minimumDisputeResolutionPeriodDays?: number;
  minimumDisputePeriodInDays?: number;
}

export default function FairExchangePolicy({
  policyIcon,
  titleTag = "p",
  bulletPointIcon,
  minimumDisputeResolutionPeriodDays = 15,
  minimumDisputePeriodInDays = 30
}: Props) {
  return (
    <>
      <InfoTitleWrapper>
        <Typography tag={titleTag} data-title>
          Fair exchange policy
        </Typography>
        {policyIcon}
      </InfoTitleWrapper>
      <InfoList withCustomMarker={!!bulletPointIcon}>
        <InfoListItem>
          {bulletPointIcon}
          <Typography tag="p">
            Min. {minimumDisputePeriodInDays} days to raise a dispute
          </Typography>
        </InfoListItem>
        <InfoListItem>
          {bulletPointIcon}
          <Typography tag="p">
            Min. {minimumDisputeResolutionPeriodDays} days to resolve a dispute
          </Typography>
        </InfoListItem>
        <InfoListItem>
          {bulletPointIcon}
          <Typography tag="p">Fair buyer and seller obligations</Typography>
        </InfoListItem>
        <InfoListItem>
          {bulletPointIcon}
          <Typography tag="p">Standard evidence requirements</Typography>
        </InfoListItem>
      </InfoList>
    </>
  );
}
