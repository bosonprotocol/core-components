/* eslint @typescript-eslint/no-explicit-any: "off" */
import React from "react";
import Select, { SingleValue } from "react-select";
import { checkIfValueIsEmpty } from "../../lib/object/checkIfValueIsEmpty";

import { theme } from "../../theme";
import { zIndex } from "../ui/zIndex";
import type { BaseSelectProps, SelectDataProps } from "./types";
import { useFixSelectFontSize } from "../../hooks/form/useFixSelectFontSize";

const colors = theme.colors.light;

const customStyles = (error: any) => ({
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: 0,
    padding: "0.4rem 0.25rem",
    boxShadow: "none",
    ":hover": {
      borderColor: colors.secondary,
      borderWidth: "1px"
    },
    background: colors.lightGrey,
    border: state.isFocused
      ? `1px solid ${colors.secondary}`
      : !checkIfValueIsEmpty(error)
        ? `1px solid ${colors.orange}`
        : `1px solid ${colors.border}`
  }),
  container: (provided: any, state: any) => ({
    ...provided,
    zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
    position: "relative",
    width: "100%"
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    opacity: state.isDisabled ? "0.5" : "1",
    background:
      state.isOptionSelected || state.isSelected || state.isFocused
        ? colors.lightGrey
        : colors.white,
    color:
      state.isOptionSelected || state.isSelected
        ? colors.secondary
        : colors.black
  }),
  indicatorsContainer: () => ({
    display: "none"
  })
});

export default function BaseSelect({
  options,
  placeholder = "Choose...",
  onChange,
  ...props
}: BaseSelectProps) {
  const handleChange = (option: SingleValue<SelectDataProps>) => {
    onChange?.(option);
  };
  const { jsx, selectClassName } = useFixSelectFontSize({
    selectClassName: "boson-base-select"
  });
  return (
    <>
      {jsx}
      <Select
        styles={customStyles(null)}
        {...props}
        className={selectClassName}
        placeholder={placeholder}
        options={options}
        onChange={handleChange}
      />
    </>
  );
}
