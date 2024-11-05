import { useField } from "formik";
import { Check } from "phosphor-react";
import React, { useEffect, useRef } from "react";

import Error from "./Error";
import { CheckboxWrapper } from "./Field.styles";
import type { CheckboxProps } from "./types";

export type BaseCheckboxProps = CheckboxProps;
export function BaseCheckbox({
  name,
  text,
  theme,
  hideError,
  className,
  iconProps,
  ...props
}: BaseCheckboxProps) {
  const [field, meta, helpers] = useField(name);
  const ref = useRef(field.value);
  const errorMessage = meta.error && meta.touched ? meta.error : "";
  const displayError = typeof errorMessage === "string" && errorMessage !== "";
  const checkboxId = `checkbox-${name}`;

  useEffect(() => {
    if (ref.current !== field.value) {
      if (!meta.touched) {
        helpers.setTouched(true);
      }
    }
  }, [field.value]); // eslint-disable-line

  return (
    <>
      <CheckboxWrapper
        htmlFor={checkboxId}
        $error={errorMessage}
        theme={theme}
        className={className}
      >
        <input
          hidden
          id={checkboxId}
          type="checkbox"
          {...props}
          {...field}
          onChange={(event) => {
            field.onChange(event);
            props.onChange?.(event);
          }}
          checked={field.value}
        />
        <div>
          <Check size={16} width="100%" height="100%" {...iconProps} />
        </div>
        <b>{text}</b>
      </CheckboxWrapper>
      <Error display={!hideError && displayError} message={errorMessage} />
    </>
  );
}
