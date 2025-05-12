import React, { useCallback, useMemo } from "react";
import toast from "react-hot-toast";

import { getImageMetadata } from "../../../lib/images/images";
import { getVideoMetadata } from "../../../lib/videos/videos";
import { colors } from "../../../theme";
import ErrorToast from "../../toasts/common/ErrorToast";
import { Typography } from "../../ui/Typography";
import { FileProps, UploadProps } from "../types";
import { useSaveImageToIpfs } from "../../../hooks/ipfs/useSaveImageToIpfs";
import { bytesToSize } from "../../../lib/bytes/bytesToSize";
import { Options } from "browser-image-compression";

export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "image/webp"
];
export type WithUploadToIpfsProps = {
  saveToIpfs: (
    files: File[] | null,
    options?: { throwOnError?: boolean }
  ) => Promise<false | FileProps[] | undefined>;
  loadMedia: (src: string) => Promise<string | undefined>;
  removeFile: (src: string) => Promise<void>;
  imageCompressionOptions?: Options;
  compressImages: boolean;
};
export function WithUploadToIpfs<P extends WithUploadToIpfsProps>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithUploadToIpfs = (
    props: Omit<P & UploadProps, keyof WithUploadToIpfsProps>
  ) => {
    const withUpload = props?.withUpload || false;
    const accept: string = props.accept || SUPPORTED_FORMATS.join(",");
    const maxSize = Number(props.maxSize) || MAX_FILE_SIZE;
    const { saveFile, loadMedia, removeFile } = useSaveImageToIpfs();

    const saveToIpfs: WithUploadToIpfsProps["saveToIpfs"] = useCallback(
      async (
        filesArray: File[] | null,
        options: { throwOnError?: boolean } = {}
      ) => {
        if (!filesArray) {
          return;
        }
        const filesErrors: string[] = [];

        for (const file of filesArray) {
          const sizeValidation = maxSize;
          const formatValidation = accept.split(",").map((acc) => acc.trim());

          if (file?.size > sizeValidation) {
            const err = `File ${
              file?.name
            } size cannot exceed more than ${bytesToSize(sizeValidation)}!`;
            if (options?.throwOnError) throw new Error(err);
            filesErrors.push(err);
          }
          if (!formatValidation.includes(file?.type)) {
            const err = `Uploaded file has unsupported format of ${file?.type}!`;
            if (options?.throwOnError) throw new Error(err);
            filesErrors.push(err);
          }
        }

        if (filesErrors.length > 0) {
          toast((t) => (
            <ErrorToast t={t}>
              <Typography tag="p" color={colors.red}>
                {filesErrors?.map((fileError) => `${fileError}\n`)}
              </Typography>
            </ErrorToast>
          ));
          return false;
        }

        const ipfsArray: FileProps[] = [];
        for (let i = 0; i < filesArray.length; i++) {
          const file = filesArray[i];
          const cid = await saveFile(file);
          const fileProps: FileProps = {
            src: `ipfs://${cid}`,
            name: file.name,
            size: file.size,
            type: file.type
          };
          const isImage = file.type.startsWith("image");
          const isVideo = file.type.startsWith("video");
          if (isImage) {
            const { width, height } = await getImageMetadata(file);
            fileProps.width = width;
            fileProps.height = height;
          } else if (isVideo) {
            const { width, height } = await getVideoMetadata(file);
            fileProps.width = width;
            fileProps.height = height;
          }
          ipfsArray.push(fileProps);
        }

        return ipfsArray;
      },
      [accept, maxSize, saveFile]
    );

    const newProps = useMemo(
      () => ({
        maxSize,
        accept,
        saveToIpfs,
        loadMedia,
        removeFile
      }),
      [saveToIpfs, loadMedia, removeFile, accept, maxSize]
    );

    if (withUpload) {
      return <WrappedComponent {...newProps} {...(props as P)} />;
    }
    return <WrappedComponent {...(props as P)} />;
  };

  return ComponentWithUploadToIpfs;
}
