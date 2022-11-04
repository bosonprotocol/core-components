import React from "react";
import { Loading } from "../Loading";

import {
  ImageContainer,
  ImageErrorText,
  ImagePlaceholder,
  ImageWrapper
} from "./Image.styles";

export interface IBaseImage extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  children?: React.ReactNode;
  dataTestId?: string;
  alt?: string;
  preloadConfig?: Partial<{
    status: "idle" | "loading" | "success" | "error";
    errorImageText?: string;
    errorIcon?: JSX.Element;
  }>;
}

export const Image: React.FC<IBaseImage> = ({
  src,
  children,
  dataTestId = "image",
  alt = "",
  preloadConfig,
  ...rest
}) => {
  const isPreloadError = preloadConfig?.status === "error";
  const isPreloadLoading =
    preloadConfig?.status === "loading" || preloadConfig?.status === "idle";

  if (isPreloadError) {
    return (
      <ImageWrapper {...rest} data-image-wrapper>
        <ImagePlaceholder data-image-placeholder position="static">
          {preloadConfig?.errorIcon ?? null}
          {preloadConfig?.errorImageText && (
            <ImageErrorText>{preloadConfig.errorImageText}</ImageErrorText>
          )}
        </ImagePlaceholder>
      </ImageWrapper>
    );
  }

  if (isPreloadLoading) {
    return (
      <ImageWrapper {...rest} data-image-wrapper>
        <ImagePlaceholder position="static">
          <div>
            <Loading />
          </div>
        </ImagePlaceholder>
      </ImageWrapper>
    );
  }

  return (
    <ImageWrapper {...rest} data-image-wrapper data-image>
      {children || ""}
      {src && <ImageContainer data-testid={dataTestId} src={src} alt={alt} />}
    </ImageWrapper>
  );
};
