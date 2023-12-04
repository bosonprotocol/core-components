import "@glidejs/glide/dist/css/glide.core.min.css";

import Glide from "@glidejs/glide";
import { CaretLeft, CaretRight } from "phosphor-react";
import React, { useEffect, useMemo, useReducer, useRef } from "react";

import { GlideSlide, GlideWrapper } from "./Detail.style";
import { breakpointNumbers } from "../../../../../lib/ui/breakpoint";
import Grid from "../../../../ui/Grid";
import ThemedButton from "../../../../ui/ThemedButton";
import IpfsImage from "../../../../ui/IpfsImage";
import { zIndex } from "../../../../ui/zIndex";
import Video from "../../../../ui/Video";
import { theme } from "../../../../../theme";
import styled from "styled-components";

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

type Direction = "<" | ">";
interface Props {
  animationUrl?: string;
  images: Array<string>;
  sliderOptions?: ConstructorParameters<typeof Glide>[1];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let glide: any = null;

export default function DetailSlider({
  animationUrl,
  images,
  sliderOptions = SLIDER_OPTIONS
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
      <GlideWrapper className="glide" ref={ref}>
        <Grid
          style={{
            position: "absolute",
            height: "100%",
            zIndex: zIndex.Carousel + 1
          }}
        >
          <Grid justifyContent="space-between">
            <ThemedButton themeVal="blank" onClick={() => handleSlider("<")}>
              <CaretLeft size={32} />
            </ThemedButton>
            <ThemedButton themeVal="blank" onClick={() => handleSlider(">")}>
              <CaretRight size={32} />
            </ThemedButton>
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
      </GlideWrapper>
    </div>
  );
}
