import { Grid } from "../../ui/Grid";
import { FilePdf, X } from "phosphor-react";
import { Typography } from "../../ui/Typography";
import React from "react";
import { colors } from "../../../colors";
import { getIpfsGatewayUrl } from "@bosonprotocol/utils";
import styled, { css } from "styled-components";
const Wrapper = styled(Grid)<
  Pick<UploadedSinglePdfFileProps, "onClick" | "urlProps">
>`
  ${({ onClick, urlProps }) =>
    onClick || urlProps
      ? css`
          cursor: pointer;
        `
      : ""}
`;
export type UploadedSinglePdfFileProps = {
  fileName: string;
  onXClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
  onClick?: () => unknown;
  urlProps?: {
    uri: Parameters<typeof getIpfsGatewayUrl>[0];
    opts: Parameters<typeof getIpfsGatewayUrl>[1];
    linkProps?: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onClick">;
  };
};
export const UploadedSinglePdfFile = ({
  fileName,
  onClick,
  onXClick,
  className,
  urlProps
}: UploadedSinglePdfFileProps) => {
  return (
    <Wrapper
      {...(urlProps
        ? {
            target: "_blank",
            rel: "noopener noreferrer",
            ...urlProps.linkProps,
            href: getIpfsGatewayUrl(urlProps.uri, urlProps.opts),
            tag: "a"
          }
        : { onClick })}
      flexDirection="row"
      alignItems="center"
      gap="0.25rem"
      className={className}
    >
      <div>
        <FilePdf size={24} />
      </div>
      <Typography
        width={"100%"}
        color={colors.purpleDeep}
        fontSize={"0.875rem"}
      >
        {fileName}
      </Typography>
      {onXClick && (
        <button
          type="button"
          style={{
            display: "flex",
            justifyContent: "center"
          }}
          onClick={(e) => {
            e.preventDefault();
            onXClick(e);
          }}
        >
          <X size={12.5} />
        </button>
      )}
    </Wrapper>
  );
};
