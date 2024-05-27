import React, { forwardRef, useMemo } from "react";
import { useField, useFormikContext } from "formik";

import Error from "./Error";
import { FieldInput, InputTheme } from "./Field.styles";
import type { InputProps as CommonInputProps } from "./types";
import { Grid } from "../ui/Grid";
import styled from "styled-components";
import { ClearButton, ClearButtonTheme } from "./ClearButton";

export type BaseInputProps = CommonInputProps & {
  heightSize?: "large" | "regular" | "small";
  theme?: InputTheme;
  clearButtonTheme?: ClearButtonTheme;
  isClearable?: boolean;
};
const StyledFieldInput = styled(FieldInput)`
  padding-right: calc(1rem + 12px);
`;
const StyledClearButton = styled(ClearButton)`
  top: 1px;
  height: calc(100% - 4px);
  margin-left: 0;
`;
export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    { name, theme, clearButtonTheme, isClearable, heightSize, ...props },
    ref
  ) => {
    const { status, setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);
    const errorText = meta.error || status?.[name];
    const errorMessage = errorText && meta.touched ? errorText : "";
    const displayError =
      typeof errorMessage === typeof "string" && errorMessage !== "";
    const InputComponent = useMemo(() => {
      const displayClearButton = isClearable && !props.disabled;
      const inputProps = {
        $heightSize: heightSize,
        theme: theme
      };
      return displayClearButton ? (
        <Grid style={{ position: "relative" }}>
          <StyledFieldInput
            $error={errorMessage}
            {...field}
            {...props}
            {...inputProps}
            ref={ref}
          />

          <StyledClearButton
            onClick={() => setFieldValue(name, "")}
            theme={clearButtonTheme}
          />
        </Grid>
      ) : (
        <FieldInput
          $error={errorMessage}
          {...field}
          {...props}
          {...inputProps}
          ref={ref}
        />
      );
    }, [
      errorMessage,
      field,
      isClearable,
      name,
      props,
      ref,
      setFieldValue,
      theme,
      clearButtonTheme,
      heightSize
    ]);
    return (
      <>
        {InputComponent}
        <Error
          display={!props.hideError && displayError}
          message={errorMessage}
        />
      </>
    );
  }
);
