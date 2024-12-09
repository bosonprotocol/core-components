import React, { ComponentProps } from "react";
import UploadedFile from "./UploadedFile";
import { UploadFileType } from "../types";
import { css, styled } from "styled-components";
import { Grid } from "../../ui/Grid";

interface Props
  extends Pick<
    ComponentProps<typeof UploadedFile>,
    "errorMessage" | "theme" | "style" | "handleChooseFile"
  > {
  files: UploadFileType[];
  handleRemoveFile: (index: number) => void;
  isPdfOnly?: boolean;
}

const Wrapper = styled.div<{ $isPdfOnly?: boolean }>`
  ${({ $isPdfOnly }) =>
    $isPdfOnly &&
    css`
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    `}
`;

export default function UploadedFiles({
  files,
  handleRemoveFile,
  isPdfOnly,
  errorMessage,
  theme,
  handleChooseFile,
  style
}: Props) {
  return (
    <Wrapper $isPdfOnly={isPdfOnly}>
      {files.map((file: UploadFileType, index: number) => {
        return (
          <UploadedFile
            isPdfOnly={isPdfOnly}
            theme={theme}
            handleChooseFile={handleChooseFile}
            style={style}
            errorMessage={errorMessage}
            key={`${file?.name || ""}_${index}`}
            fileName={file?.name || `file_${index}`}
            fileSize={Number(file?.size || 0)}
            color="white"
            handleRemoveFile={() => handleRemoveFile(index)}
            showSize
          />
        );
      })}
    </Wrapper>
  );
}
