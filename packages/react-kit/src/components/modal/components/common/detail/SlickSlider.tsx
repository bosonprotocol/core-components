import React, { ReactElement } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import _Slider, { Settings } from "react-slick";

import IpfsImage from "../../../../ui/IpfsImage";
import Video from "../../../../ui/Video";
import styled, { CSSProperties, css } from "styled-components";
import { theme } from "../../../../../theme";
import { ImageOptimizationOpts } from "../../../../../lib/images/images";
export { Settings } from "react-slick";

const colors = theme.colors.light;
const Container = styled.div<{ $alignLeft: boolean }>`
  .slick-slider {
    position: relative;
    overflow: hidden;

    .slick-arrow {
      position: absolute;
      &[data-left] {
        left: 0;
        z-index: 1;
      }
      &[data-right] {
        right: 0;
      }
    }
    .slick-list {
      .slick-track {
        ${({ $alignLeft }) =>
          $alignLeft &&
          css`
            margin-left: 0;
          `}

        .slick-slide {
          > * > * {
            padding-top: initial;
            aspect-ratio: 1;
            height: 100%;
            img,
            video {
              padding: 0.25rem;
              position: unset;
              transform: none;
              object-fit: contain;
            }
          }
          [data-active="true"] {
            border: 4px solid ${colors.blue};
          }
          [data-active="false"] {
            border: 4px solid transparent;
          }
        }
      }
    }
  }
`;

const ArrowSvg = styled.svg`
  cursor: pointer;
  :nth-of-type(1) {
    stroke: ${colors.black};
    &:hover {
      stroke: ${colors.white};
    }
  }
  :nth-of-type(2) {
    stroke: ${colors.white};
    &:hover {
      stroke: ${colors.black};
    }
  }
  &:hover {
    :nth-of-type(1) {
      stroke: ${colors.white};
    }
    :nth-of-type(2) {
      stroke: ${colors.black};
    }
  }
`;

type ArrowProps = Partial<{
  className: string;
  style: CSSProperties;
  onClick: () => void;
}>;
export function NextArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <ArrowSvg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 256 256"
      stroke-width="16"
      className={className}
      data-right
      style={style}
      onClick={onClick}
    >
      <polyline
        points="96 48 176 128 96 208"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="20"
        className="first-layer"
      ></polyline>
      <polyline
        points="96 48 176 128 96 208"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="15"
        className="second-layer"
      ></polyline>
    </ArrowSvg>
  );
}

export function PrevArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <ArrowSvg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="currentColor"
      viewBox="0 0 256 256"
      className={className}
      data-left
      style={style}
      onClick={onClick}
    >
      <polyline
        points="160 208 80 128 160 48"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="20"
        className="first-layer"
      ></polyline>
      <polyline
        points="160 208 80 128 160 48"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="15"
        className="second-layer"
      ></polyline>
    </ArrowSvg>
  );
}
export const initialSettings: Settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToScroll: 1,
  slidesToShow: 2,
  arrows: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  variableWidth: false,
  adaptiveHeight: false
};
type SlickSliderProps = {
  animationUrl?: string;
  mediaFiles: { url: string; type: "image" | "video" }[];
  settings?: Settings;
  imageOptimizationOpts?: Partial<ImageOptimizationOpts>;
  alignLeft?: boolean;
  className?: string;
  onMediaClick?: (arg0: { index: number }) => void;
  activeIndex?: number;
};
export const SlickSlider: React.FC<SlickSliderProps> = ({
  mediaFiles,
  settings = initialSettings,
  imageOptimizationOpts = {
    height: 500
  },
  className,
  alignLeft,
  onMediaClick,
  activeIndex
}) => {
  const Slider = _Slider as unknown as (props: Settings) => ReactElement;
  return (
    <>
      <Container className={className} $alignLeft={alignLeft ?? false}>
        <Slider {...settings}>
          {mediaFiles?.map(({ url, type }, index: number) => (
            <>
              {type === "image" ? (
                <IpfsImage
                  src={url}
                  style={{ cursor: "pointer" }}
                  dataTestId="sliderImage"
                  optimizationOpts={imageOptimizationOpts}
                  onClick={() => {
                    onMediaClick?.({ index });
                  }}
                  data-active={activeIndex === index ? "true" : "false"}
                />
              ) : (
                <Video
                  src={url}
                  onClick={() => {
                    onMediaClick?.({ index });
                  }}
                  style={{ cursor: "pointer" }}
                  dataTestId="offerAnimationUrl"
                  videoProps={{ muted: true, loop: true, autoPlay: true }}
                  data-active={activeIndex === index ? "true" : "false"}
                />
              )}
            </>
          ))}
        </Slider>
      </Container>
    </>
  );
};
