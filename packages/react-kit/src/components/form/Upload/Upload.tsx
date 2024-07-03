import { UploadProps } from "../types";
import BaseUpload from "./BaseUpload";
import React from "react";
export type { UploadProps } from "../types";

export const Upload = (props: UploadProps) => {
  return <BaseUpload {...props} />;
};
