import React from "react";
import { useField, useFormikContext } from "formik";

import Error from "./Error";
import { FieldInput, InputTheme } from "./Field.styles";
import type { InputProps as CommonInputProps } from "./types";

export type BaseInputProps = CommonInputProps & {
  heightSize?: "large" | "regular" | "small";
  theme?: InputTheme;
};

export function BaseInput({
  name,
  theme,
  heightSize,
  ...props
}: BaseInputProps) {
  const { status } = useFormikContext();
  const [field, meta] = useField(name);
  const errorText = meta.error || status?.[name];
  const errorMessage = errorText && meta.touched ? errorText : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  return (
    <>
      <FieldInput
        theme={theme}
        $error={errorMessage}
        {...field}
        {...props}
        $heightSize={heightSize}
      />
      <Error
        display={!props.hideError && displayError}
        message={errorMessage}
      />
    </>
  );
}
