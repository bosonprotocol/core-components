import "@glidejs/glide/dist/css/glide.core.min.css";
import Glide, { Controls, Swipe } from "@glidejs/glide/dist/glide.modular.esm";

import React, {
  ReactNode,
  forwardRef,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from "react";

import styled, { css } from "styled-components";
import { breakpointNumbers } from "../../../../../lib/ui/breakpoint";
import { theme } from "../../../../../theme";
import Grid from "../../../../ui/Grid";
import IpfsImage from "../../../../ui/IpfsImage";
import Video from "../../../../ui/Video";
import { zIndex } from "../../../../ui/zIndex";
import { GlideSlide } from "./Detail.style";

const colors = theme.colors.light;

const SLIDER_OPTIONS = {
  type: "carousel",
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
} as const;

const Container = styled.div`
  max-width: 100%;
`;

const GlideSlides = styled.div<{ $highlightActive: boolean }>`
  background: ${colors.white};
  > * {
    align-self: center;
  }
  .glide__slide {
    border-radius: 8px;
    /* &--active, */
    .active {
      ${({ $highlightActive }) =>
        $highlightActive &&
        css`
          /* border: 1px solid ${colors.darkGrey}; */
          border: 4px solid ${colors.blue};
        `}
    }
    img,
    video {
      object-fit: contain;
      padding: 0.5rem;
    }
    video {
      display: flex;
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

interface Props {
  animationUrl?: string;
  images: Array<string>;
  sliderOptions?: ConstructorParameters<typeof Glide>[1];
  arrowsAbove: boolean;
  className?: string;
  highlightActive?: boolean;
  onChangeMedia?: (arg0: { index: number }) => void;
}

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
  arrowsAbove,
  highlightActive,
  className,
  onChangeMedia
}: Props) {
  const glideRef = useRef<Glide>();
  const ref = useRef<HTMLDivElement | null>(null);
  const glideSlidesRef = useRef<HTMLDivElement | null>(null);
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
  const sumMediaFiles = media.length + (animationUrl ? 1 : 0);
  const showArrows =
    sumMediaFiles > 1 && (sliderOptions.perView ?? 1) > sumMediaFiles;
  const draggable = showArrows;
  useEffect(() => {
    if (media.length !== 0 && ref.current !== null) {
      glideRef.current = new Glide(ref.current, {
        ...sliderOptions
      });
      glideRef.current.mount({
        ...(draggable && { Swipe }),
        ...(showArrows && { Controls })
      });
      glideRef.current.on("run.after", () => {
        if (glideRef.current) {
          onChangeMedia?.({ index: glideRef.current.index });
        }
      });
    }

    return () => {
      glideRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, media, reinitializeGlide, sliderOptions]);

  const lastActiveRef = useRef<Element>();
  function onMediaClick(e: MouseEvent) {
    if (e.target instanceof Element) {
      const index = e.target.getAttribute("data-index");
      lastActiveRef.current?.classList.remove("active");
      e.target.classList.add("active");
      lastActiveRef.current = e.target;
      if (index !== null) {
        onChangeMedia?.({ index: +index });
        // glideRef.current?.go(`=${index}`);
      }
    }
  }
  useEffect(() => {
    const glideSlide = glideSlidesRef.current;
    if (glideSlide) {
      glideSlide.addEventListener("click", onMediaClick);
    }
    return () => {
      glideSlide?.removeEventListener("click", onMediaClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (media.length === 0) {
    return null;
  }

  return (
    <Container className={className}>
      <DivChildren className="glide" ref={ref}>
        {showArrows && (
          <Grid
            style={
              arrowsAbove
                ? undefined
                : {
                    position: "absolute",
                    height: "100%",
                    zIndex: zIndex.Carousel + 1,
                    pointerEvents: "none"
                  }
            }
          >
            <Grid
              justifyContent={arrowsAbove ? "flex-end" : "space-between"}
              gap="1rem"
              marginBottom="1rem"
              className="glide__arrows"
              data-glide-el="controls"
            >
              <ArrowSvg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 256 256"
                className="glide__arrow glide__arrow--left"
                data-glide-dir="<"
                style={{ pointerEvents: "all" }}
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
                className="glide__arrow glide__arrow--right"
                data-glide-dir=">"
                style={{ pointerEvents: "all" }}
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
        )}
        <div className="glide__track" data-glide-el="track">
          <GlideSlides
            className="glide__slides"
            $highlightActive={highlightActive ?? false}
            ref={glideSlidesRef}
          >
            {media?.map(({ url, type }, index: number) => (
              <GlideSlide className="glide__slide" key={`Slide_${index}`}>
                <>
                  {type === "image" ? (
                    <IpfsImage
                      data-index={index}
                      src={url}
                      style={{ paddingTop: "130%", cursor: "pointer" }}
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
                      data-index={index}
                      style={{ cursor: "pointer" }}
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
    </Container>
  );
}
