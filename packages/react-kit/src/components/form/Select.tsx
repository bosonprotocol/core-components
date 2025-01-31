import React from "react";
import { useField } from "formik";
import Select, {
  GroupBase,
  StylesConfig,
  MultiValue,
  SingleValue,
  ActionMeta,
  Props as ReactSelectProps,
  PropsValue
} from "react-select";
import { CSSProperties } from "react";
import { checkIfValueIsEmpty } from "../../lib/object/checkIfValueIsEmpty";
import { colors, getCssVar } from "../../theme";
import { zIndex } from "../ui/zIndex";
import Error from "./Error";
import { useFixSelectFont } from "../../hooks/form/useFixSelectFont";
export { GroupBase } from "react-select";

// Base theme type with proper CSS types
type SelectTheme = {
  control?: Partial<CSSProperties> & {
    hover?: Partial<CSSProperties>;
    focus?: Partial<CSSProperties>;
    error?: Partial<CSSProperties>;
  };
  option?: Partial<CSSProperties> & {
    selected?: Partial<CSSProperties>;
    disabled?: Partial<CSSProperties>;
    focus?: Partial<CSSProperties>;
    error?: Partial<CSSProperties>;
  };
  placeholder?: Partial<CSSProperties> & {
    error?: Partial<CSSProperties>;
  };
  input?: Partial<CSSProperties> & {
    error?: Partial<CSSProperties>;
  };
  singleValue?: Partial<CSSProperties> & {
    error?: Partial<CSSProperties>;
  };
};

export type DefaultSelectOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

// Base option type that all options must extend
export interface SelectOption extends Record<string, unknown> {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// Type-safe props with conditional types based on IsMulti
export type SelectProps<
  Option extends SelectOption = DefaultSelectOption,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> = Omit<ReactSelectProps<Option, IsMulti, Group>, "styles" | "theme"> & {
  name: string;
  errorMessage?: string;
  label?: string;
  theme?: Partial<SelectTheme>;
  reactSelectTheme?: ReactSelectProps<Option, IsMulti, Group>["theme"];
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
    return {
      ...provided,
      borderRadius: 0,
      padding: "0.4rem 0.25rem",
      boxShadow: "none",
      background: getCssVar("--background-color"),
      ...customTheme?.control,
      border: state.isFocused
        ? (customTheme?.control?.focus?.border ?? `1px solid ${colors.violet}`)
        : !checkIfValueIsEmpty(error)
          ? (customTheme?.control?.error?.border ??
            `1px solid ${colors.orange}`)
          : (customTheme?.control?.border ?? `1px solid ${colors.border}`),
      ":hover": {
        borderColor: colors.violet,
        borderWidth: "1px",
        ...customTheme?.control?.hover
      },
      ...("label" in state.selectProps && state.selectProps.label
        ? {
            ":before": {
              content: `"${state.selectProps.label}"`,
              fontWeight: "600",
              paddingLeft: "1rem"
            }
          }
        : {})
    };
  },
  container: (provided, state) => ({
    ...provided,
    zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
    position: "relative",
    width: "100%"
  }),
  option: (provided, state) => ({
    ...provided,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
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
  }),
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
  singleValue: (provided) => ({
    ...provided,
    color: colors.greyDark,
    fontSize: "13.33px",
    ...customTheme?.singleValue,
    ...(!checkIfValueIsEmpty(error) && customTheme?.singleValue?.error)
  })
});
export type DefaultSelectProps<IsMulti extends boolean = false> = SelectProps<
  DefaultSelectOption,
  IsMulti,
  GroupBase<DefaultSelectOption>
>;
export function SelectComponent<
  Option extends SelectOption = DefaultSelectOption,
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
  ...props
}: SelectProps<Option, IsMulti, Group>) {
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
    option: IsMulti extends true ? MultiValue<Option> : SingleValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
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

  const { jsx, selectClassName } = useFixSelectFont({
    selectClassName: "boson-select"
  });

  return (
    <>
      {jsx}
      <Select<Option, IsMulti, Group>
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
        value={field.value as PropsValue<Option>}
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

export default SelectComponent;
