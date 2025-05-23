import * as Sentry from "@sentry/browser";
import { useField } from "formik";
import { Image, Trash, VideoCamera, FilePdf, Upload } from "phosphor-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { loadAndSetMedia } from "../../../lib/base64/base64";
import { bytesToSize } from "../../../lib/bytes/bytesToSize";
import { colors } from "../../../theme";

import Loading from "../../ui/loading/LoadingWrapper";
import ThemedButton from "../../ui/ThemedButton";
import { Typography } from "../../ui/Typography";
import ErrorComponent from "../Error";
import {
  FieldFileUploadWrapper,
  FieldInput,
  PdfOnlyLabel,
  FileUploadWrapper,
  ImagePreview,
  VideoPreview
} from "../Field.styles";
import type {
  UploadFileType,
  UploadProps as UploadPropsWithNoIpfs,
  FileProps
} from "../types";
import UploadedFiles from "./UploadedFiles";
import { WithUploadToIpfs, WithUploadToIpfsProps } from "./WithUploadToIpfs";
import { useModal } from "../../modal/useModal";
import { ImageEditorModal } from "./ImageEditorModal/ImageEditorModal";
import { Grid } from "../../ui/Grid";
import { UploadedSinglePdfFile } from "./UploadedSinglePdfFile";
import imageCompression, { Options } from "browser-image-compression";

export type BaseUploadProps = UploadPropsWithNoIpfs;
function BaseUpload({
  name,
  accept = "image/*",
  disabled,
  maxSize,
  multiple = false,
  trigger,
  onFilesSelect,
  placeholder,
  wrapperProps,
  onLoadSinglePreviewImage,
  withUpload,
  withEditor,
  saveToIpfs,
  loadMedia,
  onLoading,
  width,
  height,
  borderRadius,
  borderRadiusUnit = "px",
  imgPreviewStyle,
  compressImages,
  imageCompressionOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeFile,
  saveButtonTheme,
  errorComponent,
  theme,
  ...props
}: UploadPropsWithNoIpfs & WithUploadToIpfsProps) {
  const { updateProps, store } = useModal();
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>();
  const [field, meta, helpers] = useField(name);
  const [errorMesage, setErrorMessage] = useState<string>();

  const handleLoading = useCallback(
    (loadingValue: boolean) => {
      onLoading?.(loadingValue);
      setIsLoading(loadingValue);
    },
    [onLoading]
  );

  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError = typeof errorMessage === "string" && errorMessage !== "";

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [nativeFiles, setNativeFiles] = useState<File[] | null>(null);
  const setFiles = useCallback(
    (value: unknown) => {
      helpers.setValue(value);
    },
    [helpers]
  );

  const files = field.value as UploadFileType[];
  const mimetypes = accept.split(",").map((acc) => acc.trim());
  const isImageOnly = mimetypes.every((mimetype) =>
    mimetype.startsWith("image/")
  );
  const isVideoOnly = mimetypes.every((mimetype) =>
    mimetype.startsWith("video/")
  );
  const isPdfOnly = mimetypes.every((mimetype) =>
    mimetype.startsWith("application/pdf")
  );

  useEffect(() => {
    onFilesSelect?.(files);
    helpers.setValue(files);

    if (!multiple && files && files?.length !== 0) {
      if (isImageOnly) {
        if (withUpload) {
          loadIpfsImagePreview(files[0] as FileProps);
        } else {
          loadAndSetMedia(files[0] as File, (base64Uri) => {
            setPreview(base64Uri);
            onLoadSinglePreviewImage?.(base64Uri);
          });
        }
      } else if (isVideoOnly) {
        if (withUpload) {
          loadIpfsVideo(files[0] as FileProps);
        } else {
          loadAndSetMedia(files[0] as File, (base64Uri) => {
            setPreview(base64Uri);
          });
        }
      } else if (isPdfOnly) {
        if (withUpload) {
          loadIpfsFile(files[0] as FileProps);
        } else {
          setPreview(files[0]?.name);
        }
      }
    }
  }, [files]); // eslint-disable-line

  const loadIpfsVideo = async (file: FileProps) => {
    const fileSrc = file && file?.src ? file?.src : false;
    if (!fileSrc) {
      return false;
    }
    handleLoading(true);
    try {
      const videoPreview = await loadMedia(fileSrc || "");
      if (videoPreview) {
        setPreview(videoPreview);
      } else {
        console.warn(
          `videoPreview ${videoPreview} is falsy in loadIpfsImagePreview`
        );
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    } finally {
      handleLoading(false);
    }
  };

  const loadIpfsImagePreview = async (file: FileProps) => {
    const fileSrc = file && file?.src ? file?.src : false;
    if (!fileSrc) {
      return false;
    }
    try {
      handleLoading(true);
      const imagePreview = await loadMedia(fileSrc || "");
      if (imagePreview) {
        setPreview(imagePreview);
        onLoadSinglePreviewImage?.(imagePreview);
      } else {
        console.warn(
          `imagePreview ${imagePreview} is falsy in loadIpfsImagePreview`
        );
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    } finally {
      handleLoading(false);
    }
  };

  const loadIpfsFile = async (file: FileProps) => {
    const fileSrc = file && file?.src ? file?.src : false;
    if (!fileSrc) {
      return false;
    }
    try {
      handleLoading(true);
      const filePreview = await loadMedia(fileSrc || "");
      if (filePreview) {
        setPreview(files[0]?.name);
      } else {
        console.warn(`filePreview ${filePreview} is falsy in loadIpfsFile`);
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    } finally {
      handleLoading(false);
    }
  };

  const handleChooseFile = () => {
    const input = inputRef.current;
    if (input) {
      input.click();
    }
  };

  const handleRemoveAllFiles = () => {
    if (disabled) {
      return;
    }
    setFiles([]);
    setPreview(null);
  };

  const handleRemoveFile = (index: number) => {
    const newArray = files.filter(
      (i: File | FileProps, k: number) => k !== index
    );
    setFiles(newArray);
  };

  const handleChange = useCallback(
    async (filesArray: File[] | null) => {
      if (!meta.touched) {
        helpers.setTouched(true);
      }

      if (!filesArray) {
        return;
      }
      for (const file of filesArray) {
        if (maxSize) {
          if (file.size > maxSize) {
            const error = `File size cannot exceed more than ${bytesToSize(
              maxSize
            )}`;
            // TODO: change to notification
            console.error(error);
          }
        }
      }
      setFiles(filesArray);
    },
    [helpers, maxSize, meta.touched, setFiles]
  );

  const handleSave = useCallback(
    async (efiles: File[] | null) => {
      if (!meta.touched) {
        helpers.setTouched(true);
      }
      handleLoading(true);
      try {
        const transformedFiles: File[] = [];
        for await (const file of efiles ?? []) {
          const isImage = file.type.startsWith("image");
          if (isImage && compressImages) {
            try {
              const options = imageCompressionOptions
                ? imageCompressionOptions
                : ({
                    maxSizeMB: 1,
                    useWebWorker: true
                  } satisfies Options);
              const compressedFile = await imageCompression(file, options);
              transformedFiles.push(compressedFile);
            } catch (error) {
              console.error("error while optimising image", file, error);
              transformedFiles.push(file); // if we cant optimise the size of an image, then we add it without compression
            }
          } else {
            transformedFiles.push(file);
          }
        }

        const files = await saveToIpfs(transformedFiles, {
          throwOnError: true
        });
        setErrorMessage(undefined);
        if (files) {
          setFiles(files);
        } else {
          setFiles([]);
          console.warn(
            `There has been an error because 'files' ${files} is falsy in handleSave`
          );
        }
      } catch (err) {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("Something went wrong");
        }
      } finally {
        handleLoading(false);
      }
    },
    [
      meta.touched,
      handleLoading,
      saveToIpfs,
      helpers,
      setFiles,
      compressImages,
      imageCompressionOptions
    ]
  );
  const saveFn = withUpload ? handleSave : handleChange;
  const style = {
    borderRadius: borderRadius ? `${borderRadius}${borderRadiusUnit}` : "",
    width: width ? `100%` : ""
  };
  const showPreview = !!field.value && field.value?.length !== 0 && !!preview;
  return (
    <>
      {withEditor && showEditor && (
        <ImageEditorModal
          saveButtonTheme={saveButtonTheme}
          files={nativeFiles}
          borderRadius={borderRadius}
          width={width}
          height={height}
          hideModal={async (fileList) => {
            if (fileList) {
              await saveFn(fileList);
            }

            setShowEditor(false);
            updateProps({
              ...store,
              modalType: store.modalType,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              modalProps: {
                ...store.modalProps,
                hidden: false
              }
            });
          }}
        />
      )}
      {errorMesage && errorComponent?.(errorMesage)}
      <FieldFileUploadWrapper
        {...wrapperProps}
        $isPdfOnly={isPdfOnly}
        $disabled={!!disabled}
      >
        <FieldInput
          {...props}
          hidden
          type="file"
          id={`file-${name}`}
          accept={accept}
          multiple={multiple}
          onChange={async (e) => {
            const files = e.target.files
              ? Object.values(e.target.files)
              : e.target.files;

            if (files && withEditor) {
              setNativeFiles(files);
              setShowEditor(true);
              updateProps({
                ...store,
                modalType: store.modalType,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                modalProps: {
                  ...store.modalProps,
                  hidden: true
                }
              });
            } else {
              await saveFn(files);
            }
            e.target.value = ""; // allow user to select the same file again
          }}
          ref={(ref) => {
            inputRef.current = ref;
          }}
          disabled={disabled}
        />
        {trigger ? (
          <ThemedButton onClick={handleChooseFile} type="button">
            <>{trigger}</>
          </ThemedButton>
        ) : (
          (!isPdfOnly || (isPdfOnly && files.length > 0 && !multiple)) && (
            <FileUploadWrapper
              $isPdfOnly={isPdfOnly}
              data-disabled={disabled}
              onClick={() => {
                if (!isPdfOnly) {
                  handleChooseFile();
                }
              }}
              $error={errorMessage}
              style={{ ...style, ...theme?.overrides }}
              theme={theme?.triggerTheme}
            >
              {isLoading ? (
                <Loading size={2} />
              ) : (
                <>
                  {showPreview ? (
                    <>
                      {isVideoOnly ? (
                        <VideoPreview
                          src={
                            preview?.startsWith("http")
                              ? preview
                              : preview?.startsWith(
                                    "data:application/octet-stream;base64,"
                                  )
                                ? "data:video/mp4;base64," +
                                  preview?.substring(
                                    "data:application/octet-stream;base64,"
                                      .length
                                  )
                                : preview
                          }
                          autoPlay
                          muted
                          loop
                        />
                      ) : isPdfOnly ? (
                        <UploadedSinglePdfFile
                          fileName={preview}
                          onXClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveAllFiles();
                          }}
                        />
                      ) : (
                        <ImagePreview
                          style={{ ...imgPreviewStyle }}
                          src={preview}
                        />
                      )}
                    </>
                  ) : isVideoOnly ? (
                    <VideoCamera size={24} />
                  ) : isPdfOnly ? (
                    <FilePdf size={24} />
                  ) : (
                    <Image size={24} />
                  )}
                  {placeholder && !showPreview && (
                    <Typography
                      tag="p"
                      marginBottom={0}
                      textAlign="center"
                      {...(isPdfOnly && { marginTop: 0 })}
                    >
                      {placeholder}
                    </Typography>
                  )}
                </>
              )}
            </FileUploadWrapper>
          )
        )}
        {!disabled &&
          field.value &&
          field.value?.length !== 0 &&
          preview &&
          !isPdfOnly && (
            <div onClick={handleRemoveAllFiles} data-remove style={style}>
              <Trash size={24} color={colors.white} />
            </div>
          )}
        {multiple && (
          <UploadedFiles
            style={{ ...style, ...theme?.overrides }}
            theme={theme?.triggerTheme}
            handleChooseFile={handleChooseFile}
            errorMessage={errorMessage}
            files={files}
            isPdfOnly={isPdfOnly}
            handleRemoveFile={handleRemoveFile}
          />
        )}
        {isPdfOnly && (
          <Grid>
            <PdfOnlyLabel
              htmlFor={`file-${name}`}
              style={{ ...theme?.uploadButton }}
              $disabled={disabled}
              $marginTop={files.length > 0 ? "1rem" : undefined}
            >
              Upload file <Upload size={20} />
            </PdfOnlyLabel>
          </Grid>
        )}
      </FieldFileUploadWrapper>
      <ErrorComponent display={displayError} message={errorMessage} />
    </>
  );
}

export default WithUploadToIpfs(BaseUpload);
