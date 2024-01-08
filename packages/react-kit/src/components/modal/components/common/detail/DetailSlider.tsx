import "@glidejs/glide/dist/css/glide.core.min.css";

import Glide from "@glidejs/glide";
import React, {
  ReactNode,
  forwardRef,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from "react";

import styled from "styled-components";
import { breakpointNumbers } from "../../../../../lib/ui/breakpoint";
import { theme } from "../../../../../theme";
import Grid from "../../../../ui/Grid";
import IpfsImage from "../../../../ui/IpfsImage";
import ThemedButton from "../../../../ui/ThemedButton";
import Video from "../../../../ui/Video";
import { zIndex } from "../../../../ui/zIndex";
import { GlideSlide } from "./Detail.style";

const colors = theme.colors.light;

const SLIDER_OPTIONS = {
  type: "carousel" as const,
  startAt: 0,
  gap: 20,
  perView: 3,
  breakpoints: {
    [breakpointNumbers.l]: {
      perView: 3
    },
    [breakpointNumbers.m]: {
      perView: 2
    },
    [breakpointNumbers.xs]: {
      perView: 1
    }
  }
};

const GlideSlides = styled.div`
  background: ${colors.white};
  > * {
    align-self: center;
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

type Direction = "<" | ">";
interface Props {
  animationUrl?: string;
  images: Array<string>;
  sliderOptions?: ConstructorParameters<typeof Glide>[1];
  arrowsAbove?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let glide: any = null;
const DivChildren = forwardRef(
  ({ children, ...rest }: { children: ReactNode; className: string }, ref) => (
    <div {...rest} ref={ref as React.LegacyRef<HTMLDivElement>}>
      {children}
    </div>
  )
);

export default function DetailSlider({
  animationUrl,
  images,
  sliderOptions = SLIDER_OPTIONS,
  arrowsAbove
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [reinitializeGlide, reinitiliazeGlide] = useReducer(
    (state) => state + 1,
    0
  );
  const media = useMemo(() => {
    const imgs = [...images.map((img) => ({ url: img, type: "image" }))];
    return (
      animationUrl
        ? [
            { url: animationUrl, type: "video" },
            ...images.map((img) => ({ url: img, type: "image" }))
          ]
        : imgs
    ) as { url: string; type: "image" | "video" }[];
  }, [images, animationUrl]);
  useEffect(() => {
    if (media.length !== 0 && ref.current !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      glide = new Glide(ref.current as any, {
        ...sliderOptions
      });
      glide.mount();
    }

    return () => {
      glide?.destroy();
    };
  }, [ref, media, reinitializeGlide, sliderOptions]);

  const handleSlider = (direction: Direction) => {
    glide?.go(direction);
  };

  if (media.length === 0) {
    return null;
  }
  return (
    <div style={{ maxWidth: "100%" }}>
      <DivChildren className="glide" ref={ref}>
        <Grid
          style={
            arrowsAbove
              ? undefined
              : {
                  position: "absolute",
                  height: "100%",
                  zIndex: zIndex.Carousel + 1
                }
          }
        >
          <Grid
            justifyContent={arrowsAbove ? "flex-end" : "space-between"}
            gap="1rem"
            marginBottom="1rem"
          >
            <ArrowSvg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 256 256"
              onClick={() => handleSlider("<")}
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
            <ArrowSvg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 256 256"
              stroke-width="16"
              onClick={() => handleSlider(">")}
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
          </Grid>
        </Grid>
        <div className="glide__track" data-glide-el="track">
          <GlideSlides className="glide__slides">
            {media?.map(({ url, type }, index: number) => (
              <GlideSlide className="glide__slide" key={`Slide_${index}`}>
                <>
                  {type === "image" ? (
                    <IpfsImage
                      src={url}
                      style={{ paddingTop: "130%" }}
                      dataTestId="sliderImage"
                      optimizationOpts={{
                        height: 500
                      }}
                      onSetStatus={(status) => {
                        if (status === "success") {
                          // we need to reinitilize the glide in case an image doesnt load correctly the first
                          // time (before trying the second time with a different gateway),
                          // so that the loading state is not shown indefinitely
                          reinitiliazeGlide();
                        }
                      }}
                    />
                  ) : (
                    <Video
                      src={url}
                      dataTestId="offerAnimationUrl"
                      videoProps={{ muted: true, loop: true, autoPlay: true }}
                    />
                  )}
                </>
              </GlideSlide>
            ))}
          </GlideSlides>
        </div>
      </DivChildren>
    </div>
  );
}
