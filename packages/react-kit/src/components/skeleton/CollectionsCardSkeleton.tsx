import React, { ButtonHTMLAttributes } from "react";
import styled from "styled-components";
import { theme } from "../../theme";
import { cardWrapperStyles } from "../productCard/commonStyles";
import { LoadingBubble } from "./common";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, min-content);
  ${cardWrapperStyles}
`;

const ImagesContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 1px;
  grid-row-gap: 1px;
`;

const BottomCard = styled.div`
  padding: 1rem 1.5rem 1rem 1.5rem;
`;

type SkeletonCardProps = ButtonHTMLAttributes<HTMLDivElement> & {
  withBottomText?: boolean;
};
export const CollectionsCardSkeleton = (props: SkeletonCardProps) => {
  return (
    <Container>
      <ImagesContainer>
        <LoadingBubble
          $width="100%"
          $height="170px"
          $borderRadius="0px"
          $backgroundColor={theme.colors.light.darkGrey}
        />
        <LoadingBubble
          $width="100%"
          $height="170px"
          $borderRadius="0px"
          $backgroundColor={theme.colors.light.darkGrey}
        />
        <LoadingBubble
          $width="100%"
          $height="170px"
          $borderRadius="0px"
          $backgroundColor={theme.colors.light.darkGrey}
        />
        <LoadingBubble
          $width="100%"
          $height="170px"
          $borderRadius="0px"
          $backgroundColor={theme.colors.light.darkGrey}
        />
      </ImagesContainer>
      <BottomCard>
        <LoadingBubble $width="50%" $height="26px" $margin="0 0 8.75px 0" />
        <LoadingBubble $width="52px" $height="18px" $margin="0 0 4.375px 0" />
        <LoadingBubble $width="30px" $height="30px" />
      </BottomCard>
    </Container>
  );
};
