import "@glidejs/glide/dist/css/glide.core.min.css";

import Glide from "@glidejs/glide";
import { CaretLeft, CaretRight } from "phosphor-react";
import React, { useEffect, useReducer, useRef } from "react";

import { GlideSlide, GlideWrapper } from "./Detail.style";
import { breakpointNumbers } from "../../../../../../lib/ui/breakpoint";
import Grid from "../../../../../ui/Grid";
import ThemedButton from "../../../../../ui/ThemedButton";
import IpfsImage from "../../../../../ui/IpfsImage";
import { zIndex } from "../../../../../ui/zIndex";

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

type Direction = "<" | ">";
interface Props {
  images: Array<string>;
  sliderOptions?: ConstructorParameters<typeof Glide>[1];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let glide: any = null;

export default function DetailSlider({
  images,
  sliderOptions = SLIDER_OPTIONS
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [reinitializeGlide, reinitiliazeGlide] = useReducer(
    (state) => state + 1,
    0
  );

  useEffect(() => {
    if (images.length !== 0 && ref.current !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      glide = new Glide(ref.current as any, {
        ...sliderOptions
      });
      glide.mount();
    }

    return () => {
      glide?.destroy();
    };
  }, [ref, images, reinitializeGlide, sliderOptions]);

  const handleSlider = (direction: Direction) => {
    glide?.go(direction);
  };

  if (images.length === 0) {
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
            <ThemedButton theme="blank" onClick={() => handleSlider("<")}>
              <CaretLeft size={32} />
            </ThemedButton>
            <ThemedButton theme="blank" onClick={() => handleSlider(">")}>
              <CaretRight size={32} />
            </ThemedButton>
          </Grid>
        </Grid>
        <div className="glide__track" data-glide-el="track">
          <div className="glide__slides">
            {images?.map((image: string, index: number) => (
              <GlideSlide className="glide__slide" key={`Slide_${index}`}>
                <IpfsImage
                  src={image}
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
              </GlideSlide>
            ))}
          </div>
        </div>
      </GlideWrapper>
    </div>
  );
}
