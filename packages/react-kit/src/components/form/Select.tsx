/* eslint @typescript-eslint/no-explicit-any: "off" */
import React from "react";
import { useField } from "formik";
import Select from "react-select";
import { checkIfValueIsEmpty } from "../../lib/object/checkIfValueIsEmpty";
import { theme } from "../../theme";
import { zIndex } from "../ui/zIndex";

import Error from "./Error";
import type { SelectDataProps, SelectProps } from "./types";
export type { SelectProps } from "./types";
const colors = theme.colors.light;

const customStyles = (error: unknown, customTheme: SelectProps["theme"]) => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  singleValue: (provided: any, state: any) => {
    return {
      ...provided,
      color: colors.darkGrey,
      fontSize: "13.33px",
      ...customTheme?.singleValue
    };
  },
  control: (provided: any, state: any) => {
    const before = state.selectProps.label
      ? {
          ":before": {
            content: `"${state.selectProps.label}"`,
            fontWeight: "600",
            paddingLeft: "1rem"
          }
        }
      : null;
    return {
      ...provided,
      borderRadius: 0,
      padding: "0.4rem 0.25rem",
      boxShadow: "none",
      background: colors.lightGrey,
      ...customTheme?.control,
      border: state.isFocused
        ? customTheme?.control?.focus?.border ?? `1px solid ${colors.secondary}`
        : !checkIfValueIsEmpty(error)
          ? customTheme?.control?.error?.border ?? `1px solid ${colors.orange}`
          : customTheme?.control?.border ?? `1px solid ${colors.border}`,
      ":hover": {
        borderColor: colors.secondary,
        borderWidth: "1px",
        ...customTheme?.control?.hover
      },
      ...before
    };
  },
  container: (provided: any, state: any) => ({
    ...provided,
    zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
    position: "relative",
    width: "100%"
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled
      ? customTheme?.option?.disabled?.opacity ?? "0.5"
      : customTheme?.option?.opacity ?? "1",
    background:
      state.isOptionSelected || state.isSelected || state.isFocused
        ? customTheme?.option?.selected?.background ?? colors.lightGrey
        : customTheme?.option?.background ?? colors.white,
    color:
      state.isOptionSelected || state.isSelected
        ? customTheme?.option?.selected?.color ?? colors.secondary
        : customTheme?.option?.color ?? colors.black,
    ...(state.isDisabled && customTheme?.option?.disabled),
    ...((state.isOptionSelected || state.isSelected) &&
      customTheme?.option?.selected)
  }),
  indicatorSeparator: () => ({
    display: "none"
  }),
  placeholder: (provided: any) => ({
    ...provided,
    ...customTheme?.placeholder
  }),
  input: (provided: any) => ({
    ...provided,
    ...customTheme?.input
  })
});

export default function SelectComponent({
  name,
  options,
  placeholder = "Choose...",
  isClearable = false,
  isSearchable = true,
  disabled = false,
  errorMessage,
  onChange,
  theme,
  ...props
}: SelectProps) {
  const [field, meta, helpers] = useField(name);
  const displayErrorMessage =
    meta.error && meta.touched && !errorMessage
      ? meta.error
      : meta.error && meta.touched && errorMessage
        ? errorMessage
        : "";

  const displayError =
    typeof displayErrorMessage === "string" && displayErrorMessage !== "";

  const handleChange = (option: SelectDataProps<string>) => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    helpers.setValue(option);
    onChange?.(option);
  };
  const handleBlur = () => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
  };

  return (
    <>
      <Select
        styles={customStyles(displayErrorMessage, theme)}
        {...field}
        {...props}
        placeholder={placeholder}
        options={options}
        value={field.value}
        onChange={handleChange}
        onBlur={handleBlur}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isDisabled={disabled}
        isOptionDisabled={(option) => option.disabled}
      />
      <Error display={displayError} message={displayErrorMessage} />{" "}
    </>
  );
}
