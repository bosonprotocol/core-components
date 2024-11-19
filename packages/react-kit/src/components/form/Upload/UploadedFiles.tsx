import React from "react";
import UploadedFile from "./UploadedFile";
import { UploadFileType } from "../types";

interface Props {
  files: UploadFileType[];
  handleRemoveFile: (index: number) => void;
  isPdfOnly?: boolean;
}
export default function UploadedFiles({
  files,
  handleRemoveFile,
  isPdfOnly
}: Props) {
  return (
    <>
      {files.map((file: UploadFileType, index: number) => {
        return (
          <UploadedFile
            isPdfOnly={isPdfOnly}
            key={`${file?.name || ""}_${index}`}
            fileName={file?.name || `file_${index}`}
            fileSize={Number(file?.size || 0)}
            color="white"
            handleRemoveFile={() => handleRemoveFile(index)}
            showSize
          />
        );
      })}
    </>
  );
}
