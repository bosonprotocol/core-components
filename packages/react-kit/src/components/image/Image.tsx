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
  children?: React.ReactNode;
  dataTestId?: string;
  alt?: string;
  preloadConfig?: Partial<{
    errorImageText?: string;
    errorIcon?: JSX.Element;
    disabled?: boolean;
  }>;
  onLoaded?: () => void;
}

export const Image: React.FC<IBaseImage> = ({
  src,
  children,
  dataTestId = "image",
  alt = "",
  preloadConfig = {},
  onLoaded,
  ...rest
}) => {
  const [status, setStatus] = useState<LoadingStatus>(
    preloadConfig.disabled ? "success" : "loading"
  );
  const isPreloadError = status === "error";
  const isPreloadLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <>
      <ImageWrapper {...rest} data-image-wrapper hide={!isPreloadError}>
        <ImagePlaceholder data-image-placeholder position="static">
          {preloadConfig?.errorIcon ?? null}
          {preloadConfig?.errorImageText && (
            <ImageErrorText>{preloadConfig.errorImageText}</ImageErrorText>
          )}
        </ImagePlaceholder>
      </ImageWrapper>
      <ImageWrapper {...rest} data-image-wrapper hide={!isPreloadLoading}>
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
          src={src}
          alt={alt}
          onLoad={() => {
            setStatus("success");

            if (onLoaded) {
              onLoaded();
            }
          }}
          onError={() => setStatus("error")}
        />
      </ImageWrapper>
    </>
  );
};
