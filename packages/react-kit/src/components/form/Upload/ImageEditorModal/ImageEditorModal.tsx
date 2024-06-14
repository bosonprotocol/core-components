import * as Sentry from "@sentry/browser";
import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { dataURItoBlob } from "../../../../lib/base64/base64";
import Modal from "../../../modal/Modal";
import { Grid } from "../../../ui/Grid";
import { Spinner } from "../../../ui/loading/Spinner";
import { BaseButton, BaseButtonTheme } from "../../../buttons/BaseButton";
import { ImageEditor, ImageEditorProps } from "./ImageEditor";
import { useFileImage } from "../../../../hooks/images/useFileImage";

export type ImageEditorModalProps = Omit<ImageEditorProps, "url"> & {
  files: File[] | null;
  hideModal: (files?: File[]) => Promise<void>;
  saveButtonTheme: BaseButtonTheme;
};

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  hideModal,
  files,
  saveButtonTheme,
  ...rest
}) => {
  const originalFile = files?.[0];
  const { data: url } = useFileImage(
    { file: originalFile },
    { enabled: !!originalFile }
  );
  const editorRef = useRef<AvatarEditor>(null);
  const [isSaving, setSaving] = useState<boolean>(false);
  const onClickSave = async () => {
    setSaving(true);
    try {
      const img = editorRef.current?.getImageScaledToCanvas().toDataURL();
      if (!img) {
        return;
      }
      const blob = dataURItoBlob(img);
      const file = new File([blob], originalFile?.name ?? "edited", {
        type: originalFile?.type,
        lastModified: originalFile?.lastModified
      });
      if (!file) {
        return;
      }
      await hideModal([file]);
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal
      modalType="IMAGE_EDITOR"
      hideModal={() => hideModal()}
      size="auto"
      maxWidths={{
        s: "50rem"
      }}
      theme="light"
    >
      <Grid flexDirection="column">
        <ImageEditor url={url} {...rest} ref={editorRef} />
        <BaseButton
          type="button"
          theme={saveButtonTheme}
          onClick={() => onClickSave()}
          disabled={isSaving}
        >
          {isSaving ? "Saving" : "Save"}
          {isSaving && <Spinner />}
        </BaseButton>
      </Grid>
    </Modal>
  );
};
