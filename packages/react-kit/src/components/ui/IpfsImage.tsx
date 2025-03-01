import { CameraSlash, Image as ImageIcon } from "phosphor-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { buttonText } from "./styles";
import {
  getFallbackImageUrl,
  getImageUrl,
  ImageOptimizationOpts
} from "../../lib/images/images";
import { colors } from "../../theme";
import { useIpfsContext } from "../ipfs/IpfsContext";
import { Loading } from "./loading/Loading";

import { Typography } from "./Typography";
import { zIndex } from "./zIndex";

type LoadingStatus = "loading" | "success" | "error";

const ImageWrapper = styled.div`
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

const Overlay = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${colors.greyDark};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const ImagePlaceholder = styled.div`
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

export type IpfsImageProps = React.HTMLAttributes<HTMLDivElement> & {
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
  className?: string;
};
export const IpfsImage: React.FC<IpfsImageProps> = ({
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
    setStatus((status) =>
      status === "success" ? "success" : withLoading ? "loading" : "success"
    );
    setCurrentSrc(
      getImageUrl(src, overrides?.ipfsGateway || ipfsGateway, optimizationOpts)
    );
    setDidOriginalSrcFail(false);
  }, [
    src,
    overrides?.ipfsGateway,
    ipfsGateway,
    optimizationOpts,
    currentSrc,
    withLoading
  ]);

  const isError = status === "error";
  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <ImageWrapper {...rest} className={rest.className}>
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
      {children}
      <Overlay $visible={isLoading}>
        <ImagePlaceholder>
          <Typography tag="div">
            <Loading />
          </Typography>
        </ImagePlaceholder>
      </Overlay>
      <Overlay $visible={!isLoading && (isError || !isSuccess)}>
        <ImagePlaceholder>
          {showPlaceholderText ? (
            <ImageIcon size={50} color={colors.white} />
          ) : (
            <CameraSlash size={20} color={colors.white} />
          )}
          {showPlaceholderText && (
            <Typography tag="span">IMAGE NOT AVAILABLE</Typography>
          )}
        </ImagePlaceholder>
      </Overlay>
    </ImageWrapper>
  );
};
