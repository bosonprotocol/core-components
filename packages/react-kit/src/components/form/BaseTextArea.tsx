import { useField } from "formik";
import React from "react";

import Error from "./Error";
import { FieldTextArea } from "./Field.styles";
import type { TextareaProps } from "./types";
export type BaseTextAreaProps = TextareaProps;
export function BaseTextArea({ name, theme, ...props }: TextareaProps) {
  const [field, meta] = useField(name);
  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";
  return (
    <>
      <FieldTextArea
        $error={errorMessage}
        {...field}
        {...props}
        theme={theme}
      />
      <Error display={displayError} message={errorMessage} />
    </>
  );
}
