/* eslint @typescript-eslint/no-explicit-any: "off" */
import React from "react";
import { useField } from "formik";
import Select, { GroupBase, StylesConfig } from "react-select";
import { checkIfValueIsEmpty } from "../../lib/object/checkIfValueIsEmpty";
import { colors, getCssVar } from "../../theme";
import { zIndex } from "../ui/zIndex";

import Error from "./Error";
import type { SelectDataProps, SelectProps } from "./types";
import { useFixSelectFont } from "../../hooks/form/useFixSelectFont";
export type { SelectProps } from "./types";

const customStyles = <Option extends Record<string, unknown> = SelectDataProps>(
  error: unknown,
  customTheme: SelectProps["theme"]
): StylesConfig<Option, boolean, GroupBase<Option>> => ({
  control: (provided, state: any) => {
    const before = state.selectProps.label
      ? {
          ":before": {
            content: `"${state.selectProps.label}"`,
            fontWeight: "600",
            paddingLeft: "1rem"
          }
        }
      : null;
    const defaultBorderColor =
      customTheme?.control?.borderColor || colors.border;
    return {
      ...provided,
      borderRadius: 0,
      padding: "0.4rem 0.25rem",
      boxShadow: "none",
      background: getCssVar("--background-color"),
      ...customTheme?.control,
      cursor: state.isDisabled ? "not-allowed" : "default",
      opacity: state.isDisabled
        ? (customTheme?.control?.disabled?.opacity ?? "0.5")
        : (customTheme?.control?.opacity ?? "1"),
      border: state.isDisabled
        ? `1px solid ${defaultBorderColor}`
        : state.isFocused
          ? (customTheme?.control?.focus?.border ??
            `1px solid ${colors.violet}`)
          : !checkIfValueIsEmpty(error)
            ? (customTheme?.control?.error?.border ??
              `1px solid ${colors.orange}`)
            : (customTheme?.control?.border ??
              `1px solid ${defaultBorderColor}`),
      ...(state.isDisabled
        ? {
            ":hover": {
              border: `1px solid ${defaultBorderColor}`
            }
          }
        : {
            ":hover": {
              borderColor: colors.violet,
              borderWidth: "1px",
              ...customTheme?.control?.hover
            }
          }),
      ...before
    };
  },
  container: (provided, state: any) => ({
    ...provided,
    pointerEvents: "initial",
    zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
    position: "relative",
    width: "100%"
  }),
  option: (provided, state: any) => {
    return {
      ...provided,
      cursor: state.isDisabled ? "not-allowed" : "default",
      opacity: state.isDisabled
        ? (customTheme?.option?.disabled?.opacity ?? "0.5")
        : (customTheme?.option?.opacity ?? "1"),
      background:
        state.isOptionSelected || state.isSelected || state.isFocused
          ? (customTheme?.option?.selected?.background ?? colors.greyLight)
          : (customTheme?.option?.background ?? colors.white),
      color:
        state.isOptionSelected || state.isSelected
          ? (customTheme?.option?.selected?.color ?? colors.violet)
          : (customTheme?.option?.color ?? colors.black),
      ...(state.isDisabled && customTheme?.option?.disabled),
      ...((state.isOptionSelected || state.isSelected) &&
        customTheme?.option?.selected),
      ...(state.isFocused && customTheme?.option?.focus),
      ...(!checkIfValueIsEmpty(error) && customTheme?.option?.error)
    };
  },
  indicatorsContainer: (provided, state: any) => {
    return {
      ...provided,
      ...(state.isDisabled && {
        pointerEvents: "none"
      })
    };
  },
  indicatorSeparator: () => ({
    display: "none"
  }),
  placeholder: (provided) => ({
    ...provided,
    ...customTheme?.placeholder,
    ...(!checkIfValueIsEmpty(error) && customTheme?.placeholder?.error)
  }),
  input: (provided) => ({
    ...provided,
    ...customTheme?.input,
    ...(!checkIfValueIsEmpty(error) && customTheme?.input?.error)
  }),
  singleValue: (provided) => {
    return {
      ...provided,
      color: colors.greyDark,
      fontSize: "13.33px",
      ...customTheme?.singleValue,
      ...(!checkIfValueIsEmpty(error) && customTheme?.singleValue?.error)
    };
  },
  multiValue: (provided, state: any) => {
    return {
      ...provided,
      ...customTheme?.multiValue,
      ...(state.isDisabled && {
        pointerEvents: "none"
      }),
      ...(!checkIfValueIsEmpty(error) && customTheme?.multiValue?.error)
    };
  }
});

export default function SelectComponent<
  M extends boolean,
  Option extends Record<string, unknown> = SelectDataProps
>({
  name,
  options,
  placeholder = "Choose...",
  isClearable = false,
  isSearchable = true,
  disabled = false,
  errorMessage,
  onChange,
  theme,
  isMulti,
  ...props
}: SelectProps<M, Option>) {
  const [field, meta, helpers] = useField(name);
  const displayErrorMessage =
    meta.error && meta.touched && !errorMessage
      ? meta.error
      : meta.error && meta.touched && errorMessage
        ? errorMessage
        : "";

  const displayError =
    typeof displayErrorMessage === "string" && displayErrorMessage !== "";

  const handleChange = (
    option: Parameters<NonNullable<typeof onChange>>[0],
    actionMeta: Parameters<NonNullable<typeof onChange>>[1]
  ) => {
    if (disabled) {
      return;
    }
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    helpers.setValue(option);
    onChange?.(option, actionMeta);
  };
  const handleBlur = () => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
  };
  const { jsx, selectClassName } = useFixSelectFont({
    selectClassName: "boson-select"
  });
  return (
    <>
      {jsx}
      <Select
        styles={customStyles<Option>(displayErrorMessage, theme)}
        {...field}
        {...props}
        className={selectClassName}
        isMulti={isMulti}
        placeholder={placeholder}
        options={options}
        value={field.value}
        onChange={handleChange}
        onBlur={handleBlur}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isDisabled={disabled}
        isOptionDisabled={(option) => !!option.disabled}
      />
      <Error display={displayError} message={displayErrorMessage} />{" "}
    </>
  );
}
