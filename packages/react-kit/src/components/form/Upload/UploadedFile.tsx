import { ImageSquare, X } from "phosphor-react";
import React, { useCallback } from "react";
import styled from "styled-components";
import { bytesToSize } from "../../../lib/bytes/bytesToSize";
import { theme } from "../../../theme";

import { Grid } from "../../ui/Grid";
import ThemedButton from "../../ui/ThemedButton";
import { Typography } from "../../ui/Typography";
const colors = theme.colors.light;

const AttachmentContainer = styled.div<{ $isLeftAligned: boolean }>`
  position: relative;
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 1rem;
  background-color: ${({ $isLeftAligned }) =>
    $isLeftAligned ? "inherit" : colors.lightGrey};
  ${({ $isLeftAligned }) =>
    $isLeftAligned ? `border: 2px solid ${colors.white}` : ""};
  color: ${({ $isLeftAligned }) => ($isLeftAligned ? "inherit" : colors.black)};
  margin-bottom: 0.3rem;
  svg:nth-of-type(2) {
    position: absolute;
    right: 1rem;
  }
`;

interface Props {
  fileName: string;
  fileSize: number;
  base64Content?: string;
  showSize: boolean;
  color: "grey" | "white";
  handleRemoveFile?: () => void;
}
export default function UploadedFile({
  fileName,
  fileSize,
  color,
  base64Content,
  showSize,
  handleRemoveFile
}: Props) {
  const FileContent = useCallback(() => {
    return (
      <>
        <ImageSquare size={23} />
        <Typography fontSize="1rem" fontWeight="400">
          &nbsp;&nbsp; {fileName}
        </Typography>
        {showSize && (
          <Typography tag="p">
            <small>{bytesToSize(fileSize)}</small>
          </Typography>
        )}
      </>
    );
  }, [fileName, fileSize, showSize]);
  return (
    <Grid>
      <AttachmentContainer $isLeftAligned={color === "white"}>
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
