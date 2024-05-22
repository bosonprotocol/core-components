import React from "react";
import { useField, useFormikContext } from "formik";

import Error from "./Error";
import { FieldInput } from "./Field.styles";
import type { InputProps as CommonInputProps } from "./types";
import { CSSProperties, ThemeProvider } from "styled-components";

export type BaseInputProps = CommonInputProps & {
  theme: {
    background: CSSProperties["backgroundColor"];
    borderColor: CSSProperties["borderColor"];
    borderRadius: CSSProperties["borderRadius"];
    hover: {
      borderColor: CSSProperties["borderColor"];
    };
    error: {
      borderColor: CSSProperties["borderColor"];
      hover: {
        borderColor: CSSProperties["borderColor"];
      };
      focus: {
        borderColor: CSSProperties["borderColor"];
      };
      placeholder: {
        color: CSSProperties["color"];
      };
    };
  };
};

export function BaseInput({ name, theme, ...props }: BaseInputProps) {
  const { status } = useFormikContext();
  const [field, meta] = useField(name);
  const errorText = meta.error || status?.[name];
  const errorMessage = errorText && meta.touched ? errorText : "";
  const displayError =
    typeof errorMessage === typeof "string" && errorMessage !== "";

  return (
    <ThemeProvider theme={theme}>
      <FieldInput error={errorMessage} {...field} {...props} />
      <Error
        display={!props.hideError && displayError}
        message={errorMessage}
      />
    </ThemeProvider>
  );
}
