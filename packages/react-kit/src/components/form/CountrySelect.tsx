/* eslint @typescript-eslint/no-explicit-any: "off" */
import { useField, useFormikContext } from "formik";
import { GlobeHemisphereWest } from "phosphor-react";
import React, { forwardRef, useState, useEffect } from "react";
import type { Country as CountryCode } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import Select, {
  CSSObjectWithLabel,
  GroupBase,
  StylesConfig,
  components
} from "react-select";
import styled, { CSSProperties } from "styled-components";
import { zIndex } from "../ui/zIndex";
import Error from "./Error";
import type { InputProps } from "./types";
import { SelectDataProps } from "./types";
import { theme as importedTheme } from "../../theme";
import { checkIfValueIsEmpty } from "../../lib/object/checkIfValueIsEmpty";
export type { Country as CountryCode } from "react-phone-number-input";

const colors = importedTheme.colors.light;
const customStyles = (
  error: unknown,
  customTheme: CountrySelectProps["theme"]
): StylesConfig<
  SelectDataProps<string>,
  false,
  GroupBase<SelectDataProps<string>>
> => ({
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
    return {
      ...provided,
      alignContent: "center",
      borderRadius: customTheme?.control?.borderRadius ?? 0,
      height: customTheme?.control?.height,
      padding: "0.4rem 1rem",
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
  container: (provided, state) => {
    return {
      ...provided,
      zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
      position: "relative",
      width: "100%"
    };
  },
  option: (provided, state: any) => {
    return {
      ...provided,
      ...customTheme?.option,
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
        customTheme?.option?.selected),
      ...(!checkIfValueIsEmpty(error) && customTheme?.option?.error)
    };
  },
  menu: (provided) => {
    return {
      ...provided,
      overflow: "hidden",
      ...customTheme?.menu,
      ...(!checkIfValueIsEmpty(error) && customTheme?.menu?.error)
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
  singleValue: (provided) => ({
    ...provided,
    ...customTheme?.singleValue,
    ...(!checkIfValueIsEmpty(error) && customTheme?.singleValue?.error)
  })
});

const ControlGrid = styled.div`
  display: flex;
  width: 100%;
  gap: 0.25rem;
  align-items: center;
  justify-content: space-between;
  .PhoneInputCountryIcon {
    min-width: 40px;
    display: inline;
    height: 27px;
    img {
      max-width: 40px;
    }
  }
`;
const OptionGrid = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-template-columns: 2em 1fr;
  gap: 1rem;
  align-items: center;
  .PhoneInputCountryIcon img {
    max-width: 30px;
  }
`;

const PhoneWrapper = styled.div`
  width: 100%;
  input {
    width: 100%;
    padding: 1rem;
    gap: 0.5rem;
    border-radius: 0;
    outline: none;
    font-family: "Plus Jakarta Sans";
    transition: all 150ms ease-in-out;
  }
`;

export type CountrySelectProps = InputProps & {
  countries?: CountryCode[];
  fieldValueIsCountryCode?: boolean; // if true, the field.value will be the countryCodeOrName, otherwise the country name
  theme?: Partial<{
    control: Partial<CSSProperties> &
      Partial<{
        hover: Partial<CSSProperties>;
        focus: Partial<CSSProperties>;
        error: Partial<CSSProperties>;
      }>;
    option: Partial<CSSProperties> &
      Partial<{
        selected: Partial<CSSProperties>;
        disabled: Partial<CSSProperties>;
        error: CSSProperties;
      }>;
    placeholder: Partial<CSSProperties> &
      Partial<{ error: CSSObjectWithLabel }>;
    input: Partial<CSSProperties> & Partial<{ error: CSSObjectWithLabel }>;
    singleValue: Partial<CSSProperties> &
      Partial<{ error: CSSObjectWithLabel }>;
    menu: Partial<CSSProperties> & Partial<{ error: CSSObjectWithLabel }>;
  }>;
};
type CountryName = string;
export function CountrySelect({
  name,
  countries,
  theme: selectTheme,
  fieldValueIsCountryCode,
  ...rest
}: CountrySelectProps) {
  const { status } = useFormikContext();
  const [initialized, setInitialized] = useState<boolean>(false);
  const [field, meta, helpers] = useField(name);
  const errorMessage = meta.error || status?.[name];
  const displayErrorMessage =
    meta.error && meta.touched && !errorMessage
      ? meta.error
      : meta.error && meta.touched && errorMessage
        ? errorMessage
        : "";
  const displayError =
    typeof displayErrorMessage === "string" && displayErrorMessage !== "";
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [countryCodeOrName, setCountryCodeOrName] = useState<
    CountryCode | CountryName | undefined
  >();

  useEffect(() => {
    if (!initialized && field.value) {
      setCountryCodeOrName(field.value);
      setInitialized(true);
    }
  }, [field.value, initialized]); // eslint-disable-line

  return (
    <>
      <PhoneWrapper>
        <PhoneInput
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          inputComponent={forwardRef((props, ref) => (
            <div></div>
          ))}
          addInternationalOption={false}
          country={countryCodeOrName}
          value={phone}
          onChange={(value) => setPhone((value || "").replace(/\+/g, ""))}
          countries={countries}
          countrySelectComponent={({ iconComponent: Icon, ...props }) => {
            const value = (props?.options || []).find((o: SelectDataProps) =>
              fieldValueIsCountryCode
                ? o.value === countryCodeOrName
                : o.label === countryCodeOrName
            );
            return (
              <>
                <div>
                  <Select
                    {...rest}
                    {...props}
                    isDisabled={rest.disabled}
                    styles={customStyles(displayErrorMessage, selectTheme)}
                    name="countrySelect"
                    value={value}
                    onChange={(o: SelectDataProps) => {
                      if (!meta.touched) {
                        helpers.setTouched(true);
                      }
                      const value = fieldValueIsCountryCode ? o.value : o.label;
                      setCountryCodeOrName(value);
                      helpers.setValue(value);
                    }}
                    onBlur={() => {
                      if (!meta.touched) {
                        helpers.setTouched(true);
                      }
                    }}
                    components={{
                      Control: (props) => {
                        const country =
                          (props?.getValue()[0] as any)?.value || null;
                        return (
                          <components.Control {...props}>
                            <ControlGrid>
                              {country ? (
                                <Icon
                                  country={country as CountryCode}
                                  label=""
                                />
                              ) : (
                                <GlobeHemisphereWest />
                              )}
                              {props.children as any}
                            </ControlGrid>
                          </components.Control>
                        );
                      },
                      Option: (props) => {
                        const country = (props?.data as any)?.value || null;
                        return (
                          <components.Option {...props}>
                            <OptionGrid>
                              {country ? (
                                <Icon
                                  country={country as CountryCode}
                                  label={props.label}
                                />
                              ) : (
                                <GlobeHemisphereWest />
                              )}
                              {props.label}
                            </OptionGrid>
                          </components.Option>
                        );
                      }
                    }}
                  />
                </div>
              </>
            );
          }}
        />
      </PhoneWrapper>
      <Error display={!rest.hideError && displayError} message={errorMessage} />
    </>
  );
}
