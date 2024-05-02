import { CameraSlash, Image as ImageIcon } from "phosphor-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { buttonText } from "./styles";
import {
  getFallbackImageUrl,
  getImageUrl,
  ImageOptimizationOpts
} from "../../lib/images/images";
import { theme } from "../../theme";
import { useIpfsContext } from "../ipfs/IpfsContext";
import { Loading } from "../Loading";

import { Typography } from "./Typography";
import { zIndex } from "./zIndex";
const colors = theme.colors.light;
type LoadingStatus = "loading" | "success" | "error";

const ImageWrapper = styled.div<{ $hide?: boolean }>`
  display: ${({ $hide }) => ($hide ? "none !important" : undefined)};
  overflow: hidden;
  position: relative;
  z-index: ${zIndex.OfferCard};
  height: 0;
  padding-top: 120%;
  font-size: inherit;

  > img,
  > div[data-testid="image"] {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 300ms ease-in-out;
    pointer-events: none;
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

const ImageContainer = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: ${colors.darkGrey};
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

interface IImage {
  src: string;
  children?: React.ReactNode;
  dataTestId?: string;
  alt?: string;
  showPlaceholderText?: boolean;
  withLoading?: boolean;
  optimizationOpts?: Partial<ImageOptimizationOpts>;
  onSetStatus?: (status: LoadingStatus) => void;
  overrides?: {
    ipfsGateway?: string;
  };
}
const IpfsImage: React.FC<IImage & React.HTMLAttributes<HTMLDivElement>> = ({
  src,
  children,
  dataTestId = "image",
  alt = "",
  showPlaceholderText = true,
  withLoading = true,
  optimizationOpts,
  onSetStatus,
  overrides,
  ...rest
}) => {
  const { ipfsGateway } = useIpfsContext();
  const [status, setStatus] = useState<LoadingStatus>(
    withLoading ? "loading" : "success"
  );
  const handleSetStatus = (innerStatus: LoadingStatus) => {
    setStatus(innerStatus);
    onSetStatus?.(innerStatus);
  };
  const [currentSrc, setCurrentSrc] = useState<string>(
    getImageUrl(src, overrides?.ipfsGateway || ipfsGateway, optimizationOpts)
  );
  const [didOriginalSrcFail, setDidOriginalSrcFail] = useState<boolean>(false);
  useEffect(() => {
    if (src === currentSrc) {
      return;
    }
    // reset all if src changes
    setStatus(withLoading ? "loading" : "success");
    setCurrentSrc(
      getImageUrl(src, overrides?.ipfsGateway || ipfsGateway, optimizationOpts)
    );
    setDidOriginalSrcFail(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);
  const isError = status === "error";
  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <>
      <ImageWrapper {...rest} $hide={!isLoading} className="loading-container">
        <ImagePlaceholder>
          <Typography tag="div">
            <Loading />
          </Typography>
        </ImagePlaceholder>
      </ImageWrapper>
      <ImageWrapper {...rest} $hide={!isError}>
        <ImagePlaceholder data-image-placeholder>
          {showPlaceholderText ? (
            <ImageIcon size={50} color={colors.white} />
          ) : (
            <CameraSlash size={20} color={colors.white} />
          )}
          {showPlaceholderText && (
            <Typography tag="span">IMAGE NOT AVAILABLE</Typography>
          )}
        </ImagePlaceholder>
      </ImageWrapper>
      <ImageWrapper {...rest} $hide={!isSuccess} className="image-container">
        {children || ""}
        <ImageContainer
          data-testid={dataTestId}
          src={currentSrc}
          alt={alt}
          onLoad={() => handleSetStatus("success")}
          onError={() => {
            if (didOriginalSrcFail) {
              handleSetStatus("error");
            } else {
              setDidOriginalSrcFail(true);
              const fallbackUrl = getFallbackImageUrl(
                src,
                ipfsGateway,
                optimizationOpts
              );
              if (
                fallbackUrl.startsWith("unsafe:") ||
                fallbackUrl === currentSrc
              ) {
                handleSetStatus("error");
              } else {
                setCurrentSrc(fallbackUrl);
              }
            }
          }}
        />
      </ImageWrapper>
    </>
  );
};

export default IpfsImage;
