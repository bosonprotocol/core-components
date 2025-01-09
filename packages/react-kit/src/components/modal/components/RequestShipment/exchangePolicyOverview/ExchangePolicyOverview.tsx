import React from "react";
import { styled } from "styled-components";
import { Grid } from "../../../../ui/Grid";
import { FairExchangePolicy } from "./FairExchangePolicy";
import { Button } from "../../../../buttons/Button";
import { InfoBox } from "./InfoBox";
import { colors } from "../../../../../theme";

const Wrapper = styled(Grid)``;

export type ExchangePolicyOverviewProps = {
  onPolicyClick: () => void;
  onNextClick: () => void;
};

export const ExchangePolicyOverview = ({
  onPolicyClick,
  onNextClick
}: ExchangePolicyOverviewProps) => {
  return (
    <Wrapper flexDirection="column" alignItems="flex-start" gap="2rem">
      <FairExchangePolicy
        policyIcon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ cursor: "pointer" }}
            onClick={onPolicyClick}
          >
            <path
              d="M2.16667 15.5C1.70833 15.5 1.31583 15.3369 0.989167 15.0108C0.663055 14.6842 0.5 14.2917 0.5 13.8333V2.16667C0.5 1.70833 0.663055 1.31583 0.989167 0.989167C1.31583 0.663055 1.70833 0.5 2.16667 0.5H8V2.16667H2.16667V13.8333H13.8333V8H15.5V13.8333C15.5 14.2917 15.3369 14.6842 15.0108 15.0108C14.6842 15.3369 14.2917 15.5 13.8333 15.5H2.16667ZM6.08333 11.0833L4.91667 9.91667L12.6667 2.16667H9.66667V0.5H15.5V6.33333H13.8333V3.33333L6.08333 11.0833Z"
              fill={colors.violet}
            />
          </svg>
        }
      />
      <InfoBox
        message="If you don't want to receive your item right away, you can request shipment at a later stage as well."
        customTheme={{
          wrapperStyle: {
            backgroundColor: colors.greyLight
          },
          iconProps: {
            size: 24,
            style: { minWidth: "24px" }
          }
        }}
      />
      <Button fill onClick={onNextClick} type="button">
        Next
      </Button>
    </Wrapper>
  );
};
