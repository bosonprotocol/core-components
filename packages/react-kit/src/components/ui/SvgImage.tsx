import React from "react";
import { useQuery } from "react-query";
import styled, { CSSProperties } from "styled-components";
import { withQueryClientProvider } from "../queryClient/withQueryClientProvider";

export type SvgImageProps = Pick<CSSProperties, "color"> & {
  width?: number;
  height?: number;
  src: string | React.FC | undefined;
  alt?: string;
  style?: CSSProperties;
  id?: string;
};

const SvgWrapper = styled.div`
  > * {
    width: 100%;
    height: 100%;
  }
`;

export const SvgImage: React.FC<SvgImageProps> = withQueryClientProvider(
  ({ src, ...rest }) => {
    const isStringWithSvg =
      !!src && typeof src === "string" && src.toLowerCase().startsWith("<svg");
    const { data: svgHtml, isLoading } = useQuery(
      [src],
      async () => {
        if (typeof src !== "string") {
          return;
        }
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch SVG: ${response.statusText}, svg: ${src}`
          );
        }
        const svgText = await response.text();
        return svgText;
      },
      {
        enabled: isStringWithSvg,
        staleTime: Infinity
      }
    );
    if (typeof src === "string") {
      if (isLoading) {
        return <></>;
      }
      if (svgHtml) {
        const { width, height, color, style, ...restProps } = rest;
        const fixedWidth = width === undefined ? width : `${width}px`;
        const fixedHeight = height === undefined ? height : `${height}px`;
        return (
          <SvgWrapper
            dangerouslySetInnerHTML={{ __html: svgHtml }}
            {...restProps}
            style={{ ...style, width: fixedWidth, height: fixedHeight, color }}
          />
        );
      }
      // eslint-disable-next-line jsx-a11y/alt-text
      return <img src={src} {...rest} />;
    }
    const Component = src;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <Component {...rest} />;
  }
);
