import React, { useState } from "react";
import { Loading } from "../Loading";

import {
  ImageContainer,
  ImageErrorText,
  ImagePlaceholder,
  ImageWrapper
} from "./Image.styles";

type LoadingStatus = "loading" | "success" | "error";

export interface IBaseImage extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  fallbackSrc?: string;
  children?: React.ReactNode;
  dataTestId?: string;
  alt?: string;
  withLoading?: boolean;
  errorConfig?: Partial<{
    errorImageText: string;
    errorIcon: JSX.Element;
  }>;
  onLoaded?: () => void;
}

export const Image: React.FC<IBaseImage> = ({
  src,
  fallbackSrc,
  children,
  dataTestId = "image",
  alt = "",
  withLoading,
  errorConfig = {},
  onLoaded,
  ...rest
}) => {
  const [status, setStatus] = useState<LoadingStatus>(
    withLoading ? "loading" : "success"
  );
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [didOriginalSrcFail, setDidOriginalSrcFail] = useState<boolean>(false);

  const isError = status === "error";
  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <>
      <ImageWrapper {...rest} data-image-wrapper hide={!isError}>
        <ImagePlaceholder data-image-placeholder position="static">
          {errorConfig.errorIcon ?? null}
          <ImageErrorText>
            {errorConfig.errorImageText || "Failed to load image"}
          </ImageErrorText>
        </ImagePlaceholder>
      </ImageWrapper>
      <ImageWrapper {...rest} data-image-wrapper hide={!isLoading}>
        <ImagePlaceholder data-image-placeholder position="static">
          <div>
            <Loading />
          </div>
        </ImagePlaceholder>
      </ImageWrapper>
      <ImageWrapper {...rest} data-image-wrapper data-image hide={!isSuccess}>
        {children || ""}
        <ImageContainer
          data-testid={dataTestId}
          src={currentSrc}
          alt={alt}
          onLoad={() => {
            setStatus("success");

            if (onLoaded) {
              onLoaded();
            }
          }}
          onError={() => {
            if (didOriginalSrcFail || !fallbackSrc) {
              setStatus("error");
            } else {
              setDidOriginalSrcFail(true);
              setCurrentSrc(fallbackSrc);
            }
          }}
        />
      </ImageWrapper>
    </>
  );
};
