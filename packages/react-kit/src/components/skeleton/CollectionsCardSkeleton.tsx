import React, { ButtonHTMLAttributes } from "react";
import styled from "styled-components";
import { theme } from "../../theme";
import { cardWrapperStyles } from "../productCard/commonStyles";
import { LoadingBubble } from "./common";
const colors = theme.colors.light;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  ${cardWrapperStyles}
  /* REMs gives bad height here on smaller views */
  height: 279px;
  min-width: 265px;
`;

const ImagesContainer = styled.div`
  width: 100%;
  position: relative;
  /* REMs gives bad height here on smaller views */
  height: 208px;
  background-color: ${colors.lightGrey};
`;

const BottomCard = styled.div`
  padding: 1rem 1.5rem 1rem 1.5rem;
`;

const ImageOne = styled.div`
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
`;
const ImageTwo = styled.div`
  position: absolute;
  right: 10%;
  top: 5%;
`;
const ImageThree = styled.div`
  position: absolute;
  right: 10%;
  bottom: 5%;
`;
type SkeletonCardProps = ButtonHTMLAttributes<HTMLDivElement> & {
  withBottomText?: boolean;
};
export const CollectionsCardSkeleton = (props: SkeletonCardProps) => {
  return (
    <Container>
      <ImagesContainer>
        <ImageOne>
          <LoadingBubble
            $width="140px"
            $height="102px"
            $borderRadius="0px"
            $backgroundColor={theme.colors.light.darkGrey}
          />
        </ImageOne>
        <ImageTwo>
          <LoadingBubble
            $width="60px"
            $height="50px"
            $borderRadius="0px"
            $backgroundColor={theme.colors.light.darkGrey}
          />
        </ImageTwo>
        <ImageThree>
          <LoadingBubble
            $width="60px"
            $height="50px"
            $borderRadius="0px"
            $backgroundColor={theme.colors.light.darkGrey}
          />
        </ImageThree>
      </ImagesContainer>
      <BottomCard>
        <LoadingBubble $width="50%" $height="26px" $margin="0 0 8.75px 0" />
        <LoadingBubble $width="52px" $height="18px" $margin="0 0 4.375px 0" />
        <LoadingBubble $width="30px" $height="30px" />
      </BottomCard>
    </Container>
  );
};
