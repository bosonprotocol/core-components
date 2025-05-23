import React, { ReactNode } from "react";
import { useField } from "formik";
import ReactSelect, {
  GroupBase,
  StylesConfig,
  MultiValue,
  SingleValue,
  ActionMeta,
  Props as ReactSelectProps,
  CSSObjectWithLabel
} from "react-select";
import { CSSProperties } from "react";
import { checkIfValueIsEmpty } from "../../lib/object/checkIfValueIsEmpty";
import { colors, getCssVar } from "../../theme";
import { zIndex } from "../ui/zIndex";
import Error from "./Error";
import { useFixSelectFont } from "../../hooks/form/useFixSelectFont";
import { SelectDataProps } from "./types";
export { GroupBase } from "react-select";

// Base theme type with proper CSS types
type SelectTheme = Partial<{
  control: Partial<CSSProperties> &
    Partial<{
      disabled: Partial<CSSProperties>;
      hover: Partial<CSSProperties>;
      focus: Partial<CSSProperties>;
      error: Partial<CSSProperties>;
    }>;
  option: Partial<CSSProperties> &
    Partial<{
      selected: Partial<CSSProperties>;
      disabled: Partial<CSSProperties>;
      focus: Partial<CSSProperties>;
      error: Partial<CSSObjectWithLabel>;
    }>;
  placeholder: Partial<CSSProperties> & Partial<{ error: CSSObjectWithLabel }>;
  input: Partial<CSSProperties> & Partial<{ error: CSSObjectWithLabel }>;
  singleValue: Partial<CSSProperties> & Partial<{ error: CSSObjectWithLabel }>;
  multiValue: Partial<CSSProperties> & Partial<{ error: CSSObjectWithLabel }>;
}>;

// Base option type that all options must extend
export type SelectOption<Value = unknown, Label = ReactNode> = SelectDataProps<
  Value,
  Label
>;

// Type-safe props with conditional types based on IsMulti
export type SelectProps<
  Option extends SelectOption = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> = Omit<ReactSelectProps<Option, IsMulti, Group>, "styles" | "theme"> & {
  name: string;
  errorMessage?: string;
  label?: string;
  theme?: Partial<SelectTheme>;
  reactSelectTheme?: ReactSelectProps<Option, IsMulti, Group>["theme"];
  selectRef?: Parameters<typeof ReactSelect<Option, IsMulti, Group>>[0]["ref"];
};

// Custom styles function with proper typing
const customStyles = <
  Option extends SelectOption,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  error: unknown,
  customTheme?: Partial<SelectTheme>
): StylesConfig<Option, IsMulti, Group> => ({
  control: (provided, state) => {
    const before =
      "label" in state.selectProps && state.selectProps.label
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
  container: (provided, state) => ({
    ...provided,
    pointerEvents: "initial",
    zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
    position: "relative",
    width: "100%"
  }),
  option: (provided, state) => {
    return {
      ...provided,
      cursor: state.isDisabled ? "not-allowed" : "default",
      opacity: state.isDisabled
        ? (customTheme?.option?.disabled?.opacity ?? "0.5")
        : (customTheme?.option?.opacity ?? "1"),
      background:
        state.isSelected || state.isFocused
          ? (customTheme?.option?.selected?.background ?? colors.greyLight)
          : (customTheme?.option?.background ?? colors.white),
      color: state.isSelected
        ? (customTheme?.option?.selected?.color ?? colors.violet)
        : (customTheme?.option?.color ?? colors.black),
      ...(state.isDisabled && customTheme?.option?.disabled),
      ...(state.isSelected && customTheme?.option?.selected),
      ...(state.isFocused && customTheme?.option?.focus),
      ...(!checkIfValueIsEmpty(error) && customTheme?.option?.error)
    };
  },
  indicatorsContainer: (provided, state) => {
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
  multiValue: (provided, state) => {
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
export type DefaultSelectProps<IsMulti extends boolean = false> = SelectProps<
  SelectOption,
  IsMulti,
  GroupBase<SelectOption>
>;
export function Select<
  Option extends SelectOption = SelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  name,
  options,
  placeholder = "Choose...",
  isClearable = false,
  isSearchable = true,
  isDisabled = false,
  errorMessage,
  onChange,
  onBlur,
  theme,
  reactSelectTheme,
  isMulti,
  selectRef,
  ...props
}: SelectProps<Option, IsMulti, Group>) {
  const [field, meta, helpers] =
    useField<IsMulti extends true ? MultiValue<Option> : SingleValue<Option>>(
      name
    );

  const displayErrorMessage =
    meta.error && meta.touched && !errorMessage
      ? meta.error
      : meta.error && meta.touched && errorMessage
        ? errorMessage
        : "";

  const displayError =
    typeof displayErrorMessage === "string" && displayErrorMessage !== "";

  const handleChange = (
    option: IsMulti extends true ? MultiValue<Option> : SingleValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    if (isDisabled) {
      return;
    }
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    helpers.setValue(option);
    onChange?.(option, actionMeta);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    field.onBlur(event);
    onBlur?.(event);
  };

  const { selectClassName } = useFixSelectFont({
    selectClassName: "boson-select",
    hasError: displayError
  });

  return (
    <>
      <ReactSelect<Option, IsMulti, Group>
        ref={selectRef}
        styles={customStyles<Option, IsMulti, Group>(
          displayErrorMessage,
          theme
        )}
        {...field}
        {...props}
        theme={reactSelectTheme}
        className={selectClassName}
        isMulti={isMulti}
        placeholder={placeholder}
        options={options}
        value={field.value}
        onChange={handleChange}
        onBlur={handleBlur}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isDisabled={isDisabled}
        isOptionDisabled={(option) => !!option.disabled}
      />
      <Error display={displayError} message={displayErrorMessage} />
    </>
  );
}
