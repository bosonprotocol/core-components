import { VideoCameraSlash, VideoCamera as VideoIcon } from "phosphor-react";
import React, {
  ElementRef,
  ReactElement,
  ReactNode,
  VideoHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import styled, { CSSProperties, css } from "styled-components";
import { useIpfsStorage } from "../../hooks/useIpfsStorage";
import { fetchIpfsBase64Media } from "@bosonprotocol/utils";
import { colors } from "../../theme";
import { Loading } from "./loading/Loading";

import { MuteButton } from "./MuteButton";
import { Typography } from "./Typography";
import { buttonText } from "./styles";
import { zIndex } from "./zIndex";

const StyledMuteButton = styled(MuteButton)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1;
`;
const VideoWrapper = styled.div<{ $hasOnClick?: boolean }>`
  overflow: hidden;
  position: relative;
  z-index: ${zIndex.OfferCard};
  /* height: 0;
  padding-top: 120%; */
  font-size: inherit;
  ${({ $hasOnClick }) =>
    $hasOnClick &&
    css`
      cursor: pointer;
    `}

  > video,
  > div[data-testid="video"] {
    /* position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 300ms ease-in-out; */
    ${({ $hasOnClick }) =>
      !$hasOnClick &&
      css`
        pointer-events: none;
      `}
  }

  [data-testid="statuses"] {
    position: absolute;
    z-index: ${zIndex.OfferStatus};
    top: 1rem;
    right: -1rem;
    margin: 0 auto;
    justify-content: flex-end;
  }
`;

const VideoHtml = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const VideoPlaceholder = styled.div<{ $position?: CSSProperties["position"] }>`
  ${({ $position }) =>
    $position
      ? css`
          position: ${$position};
        `
      : css`
          position: absolute;
        `}
  top: 0;
  height: 100%;
  width: 100%;
  background-color: ${colors.greyDark};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span {
    ${buttonText}
    font-size: inherit;
    line-height: 1;
    color: ${colors.white};
    padding: 1rem;
    text-align: center;
  }
`;

export type VideoProps = React.HTMLAttributes<HTMLDivElement> & {
  src: string;
  children?: ReactNode;
  dataTestId?: string;
  showPlaceholderText?: boolean;
  noPreload?: boolean;
  videoProps?: VideoHTMLAttributes<HTMLElement>;
  withMuteButton?: boolean;
  componentWhileLoading?: () => ReactElement;
};
export const Video: React.FC<VideoProps> = ({
  src,
  children,
  dataTestId = "video",
  showPlaceholderText = true,
  noPreload = false,
  videoProps,
  withMuteButton,
  componentWhileLoading: ComponentWhileLoading,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(noPreload);
  const [isError, setIsError] = useState<boolean>(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(
    noPreload ? src : null
  );
  const ipfsMetadataStorage = useIpfsStorage();
  useEffect(() => {
    async function fetchData(src: string) {
      if (ipfsMetadataStorage && !src?.includes("undefined")) {
        try {
          const [base64str] = await fetchIpfsBase64Media(
            [src],
            ipfsMetadataStorage
          );
          setVideoSrc(base64str as string);
          setIsLoaded(true);
          setIsError(false);
        } catch (error) {
          console.error("error in Video", error);
          setIsLoaded(true);
          setIsError(true);
        }
      } else {
        setIsLoaded(true);
        setIsError(true);
      }
    }
    if (!isLoaded && videoSrc === null) {
      if (
        src?.startsWith("ipfs://") ||
        src?.startsWith("https://bosonprotocol.infura-ipfs.io/ipfs/")
      ) {
        const split = src?.startsWith("ipfs://")
          ? src.split("//")
          : src.split("https://bosonprotocol.infura-ipfs.io/ipfs/");
        const CID = split[split.length - 1];
        fetchData(`ipfs://${CID}`);
      } else if (src?.startsWith("undefined") && src?.length > 9) {
        const CID = src.replace("undefined", "");
        fetchData(`ipfs://${CID}`);
      } else {
        setVideoSrc(src);
      }
    }
  }, []); // eslint-disable-line

  const mp4Src = useMemo(() => {
    const octetSrc =
      videoSrc?.startsWith("data:application/octet-stream;base64,") || false;

    if (videoSrc && octetSrc) {
      return `data:video/mp4;base64,${videoSrc?.replace(
        "data:application/octet-stream;base64,",
        ""
      )}`;
    }
    return videoSrc || "";
  }, [videoSrc]);
  const videoRef = useRef<ElementRef<"video">>(null);
  const [muted, setMuted] = useState<boolean>(!!videoProps?.muted);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = muted;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef.current?.defaultMuted]);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.autoplay = false;
      videoRef.current.pause();
      videoRef.current.muted = muted;
      videoRef.current.play();
    }
  }, [muted]);

  if (!isLoaded && !isError) {
    if (ComponentWhileLoading) {
      return <ComponentWhileLoading />;
    }
    return (
      <VideoWrapper {...rest} className="video-container">
        <VideoPlaceholder $position="static">
          <Typography tag="div">
            <Loading />
          </Typography>
        </VideoPlaceholder>
      </VideoWrapper>
    );
  }

  if (isLoaded && isError) {
    return (
      <VideoWrapper {...rest} className="video-container">
        <VideoPlaceholder data-video-placeholder $position="static">
          {showPlaceholderText ? (
            <VideoIcon size={50} color={colors.white} />
          ) : (
            <VideoCameraSlash size={20} color={colors.white} />
          )}
          {showPlaceholderText && (
            <Typography tag="span">VIDEO NOT AVAILABLE</Typography>
          )}
        </VideoPlaceholder>
      </VideoWrapper>
    );
  }

  return (
    <VideoWrapper
      {...rest}
      $hasOnClick={!!rest.onClick}
      className="video-container"
    >
      {children || ""}
      {videoSrc && (
        <>
          {withMuteButton && (
            <StyledMuteButton
              muted={muted}
              onClick={() => setMuted((prev) => !prev)}
            />
          )}
          <VideoHtml
            ref={videoRef}
            data-testid={dataTestId}
            {...videoProps}
            src={mp4Src || ""}
            onError={() => {
              setIsLoaded(true);
              setIsError(true);
            }}
          />
        </>
      )}
    </VideoWrapper>
  );
};

export default Video;
