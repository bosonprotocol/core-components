import { ImageSquare, X, FilePdf } from "phosphor-react";
import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import { bytesToSize } from "@bosonprotocol/utils";

import { Grid } from "../../ui/Grid";
import ThemedButton from "../../ui/ThemedButton";
import { Typography } from "../../ui/Typography";
import { FileUploadWrapper } from "../Field.styles";
import { UploadProps } from "../types";
import { colors } from "../../../theme";

const AttachmentContainer = styled.div<{
  $isLeftAligned: boolean;
  $isPdfFile?: boolean;
}>`
  position: relative;
  display: flex;
  cursor: pointer;
  align-items: center;
  color: ${({ $isLeftAligned }) => ($isLeftAligned ? "inherit" : colors.black)};

  ${({ $isPdfFile, $isLeftAligned }) =>
    $isPdfFile
      ? css`
          width: 100%;
        `
      : css`
          padding: 1rem;
          background-color: ${$isLeftAligned ? "inherit" : colors.greyLight};
          ${$isLeftAligned ? `border: 2px solid ${colors.white}` : ""};
        `}

  svg:nth-of-type(2) {
    position: absolute;
    right: 1rem;
  }
`;

interface Props extends Pick<UploadProps, "theme" | "disabled"> {
  fileName: string;
  fileSize: number;
  base64Content?: string;
  showSize: boolean;
  alignToLeft?: boolean;
  errorMessage: unknown;
  isPdfOnly?: boolean;
  handleRemoveFile?: () => void;
  handleChooseFile?: () => void;
  style?: React.CSSProperties;
}

export default function UploadedFile({
  fileName,
  fileSize,
  base64Content,
  showSize,
  isPdfOnly,
  handleRemoveFile,
  handleChooseFile,
  theme,
  disabled,
  style,
  alignToLeft,
  errorMessage
}: Props) {
  const FileContent = useCallback(() => {
    return (
      <FileUploadWrapper
        $isPdfOnly={isPdfOnly}
        data-disabled={disabled}
        onClick={() => {
          if (!isPdfOnly) {
            handleChooseFile?.();
          }
        }}
        $error={errorMessage}
        style={{ ...style, ...theme?.overrides }}
        theme={theme?.triggerTheme}
      >
        <Grid flexDirection="row" alignItems="start">
          {isPdfOnly ? <FilePdf size={23} /> : <ImageSquare size={23} />}
          <Typography fontSize="1rem" fontWeight="400">
            &nbsp;&nbsp; {fileName}
          </Typography>
        </Grid>
        {showSize && (
          <Typography tag="p">
            <small>{bytesToSize(fileSize)}</small>
          </Typography>
        )}
      </FileUploadWrapper>
    );
  }, [
    fileName,
    isPdfOnly,
    disabled,
    fileSize,
    showSize,
    handleChooseFile,
    theme,
    style,
    errorMessage
  ]);

  return (
    <Grid>
      <AttachmentContainer
        $isPdfFile={isPdfOnly}
        $isLeftAligned={alignToLeft ?? false}
      >
        {base64Content ? (
          <a
            style={{ display: "flex", color: "inherit" }}
            href={base64Content}
            download={fileName}
          >
            <FileContent />
          </a>
        ) : (
          <FileContent />
        )}
        {handleRemoveFile && (
          <ThemedButton onClick={() => handleRemoveFile()} themeVal="blank">
            <X size={24} />
          </ThemedButton>
        )}
      </AttachmentContainer>
    </Grid>
  );
}
