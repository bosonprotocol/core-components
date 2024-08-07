import React from "react";
import { CSSProperties } from "styled-components";

export type SvgImageProps = Pick<CSSProperties, "width" | "height"> & {
  src: string | React.FC | undefined;
  alt?: string;
  style?: CSSProperties;
  id?: string;
};

export const SvgImage: React.FC<SvgImageProps> = ({ src, ...rest }) => {
  if (typeof src === "string") {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img src={src} {...rest} />;
  }
  const Component = src;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <Component {...rest} />;
};
