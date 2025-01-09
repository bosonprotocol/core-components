import { TextAlignLeft } from "phosphor-react";
import React from "react";
import styled from "styled-components";
import { colors, getCssVar } from "../../../../../theme";
import SellerID from "../../../../avatar/SellerID";
import { Grid } from "../../../../ui/Grid";
import { Offer } from "../../../../../types/offer";
import { LoadingBubble } from "../../../../skeleton/common";

const Container = styled(Grid)`
  background: ${getCssVar("--background-accent-color")};
  padding: 1rem;
  flex-direction: column;
  .seller-id {
    * {
      font-size: 1rem;
      white-space: nowrap;
    }
    img.avatar {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  .description {
    color: ${colors.violet};
    font-weight: 600;
    font-size: 0.875rem;
    justify-content: flex-end;
    gap: 0.7344rem;
    width: 100%;
    white-space: nowrap;
    display: flex;
    align-items: center;

    &:hover {
      background: ${getCssVar("--border-color")};
      cursor: pointer;
    }
  }
  @container (width > 300px) {
    flex-direction: row;
  }
`;

type Props = {
  offer: Offer;
  onViewFullDescription: () => void;
  loadingViewFullDescription: boolean;
};
const StyledTextAlignLeft = styled(TextAlignLeft)`
  && {
    stroke: none;
  }
`;
export function SellerAndDescription({
  offer,
  onViewFullDescription,
  loadingViewFullDescription
}: Props) {
  return (
    <Container flex="1" gap="1rem">
      <SellerID
        offer={offer}
        buyerOrSeller={offer?.seller}
        justifyContent="flex-start"
        withProfileImage
        className="seller-id"
      />
      {loadingViewFullDescription ? (
        <LoadingBubble
          $width="100%"
          $height="30px"
          $backgroundColor={colors.greyDark}
          style={{ flex: "initial" }}
        />
      ) : (
        <div onClick={onViewFullDescription} className="description">
          <span style={{ textAlign: "right" }}>
            View full offer description
          </span>
          <StyledTextAlignLeft size={30} color={colors.violet} />
        </div>
      )}
    </Container>
  );
}
