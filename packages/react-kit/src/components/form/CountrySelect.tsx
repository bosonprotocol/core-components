/* eslint @typescript-eslint/no-explicit-any: "off" */
import { useField, useFormikContext } from "formik";
import { GlobeHemisphereWest } from "phosphor-react";
import React, { forwardRef, useState, useEffect } from "react";
import type { Country as CountryCode } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import Select, { GroupBase, StylesConfig, components } from "react-select";
import styled, { CSSProperties } from "styled-components";
import { zIndex } from "../ui/zIndex";
import Error from "./Error";
import type { InputProps } from "./types";
import { SelectDataProps } from "./types";
import { theme as importedTheme } from "../../theme";
export type { Country as CountryCode } from "react-phone-number-input";

const colors = importedTheme.colors.light;
const customStyles = {
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
    const { theme } = state;
    return {
      ...provided,
      borderRadius: theme.borderRadius,
      height: theme.controlHeight,
      alignContent: "center",
      padding: "0.4rem 1rem",
      boxShadow: "none",
      ":hover": {
        borderColor: theme.colors.controlHoverBorderColor,
        borderWidth: "1px"
      },
      background: theme.colors.controlBackground,
      border: state.isFocused
        ? `1px solid ${theme.colors.controlFocusBorderColor}`
        : `1px solid ${theme.colors.controlUnfocusedBorderColor}`,
      ...before
    };
  },
  container: (provided: any, state: any) => {
    return {
      ...provided,
      zIndex: state.isFocused ? zIndex.Select + 1 : zIndex.Select,
      position: "relative",
      width: "100%"
    };
  },
  option: (provided: any, state: any) => {
    const { theme } = state;
    return {
      ...provided,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      opacity: state.isDisabled ? "0.5" : "1",
      background:
        state.isOptionSelected || state.isSelected || state.isFocused
          ? theme.colors.selectedOptionBackground
          : theme.colors.unselectedOptionBackground,
      color:
        state.isOptionSelected || state.isSelected
          ? theme.colors.selectedOptionColor
          : theme.colors.unselectedOptionColor
    };
  },
  indicatorSeparator: () => ({
    display: "none"
  })
} satisfies StylesConfig<
  SelectDataProps<string>,
  false,
  GroupBase<SelectDataProps<string>>
>;

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
  theme?: Partial<{
    controlHeight: CSSProperties["height"];
    borderRadius: CSSProperties["borderRadius"];
    controlHoverBorderColor: CSSProperties["borderColor"];
    controlBackground: CSSProperties["background"];
    controlFocusBorderColor: CSSProperties["borderColor"];
    controlUnfocusedBorderColor: CSSProperties["borderColor"];
    selectedOptionBackground: CSSProperties["background"];
    unselectedOptionBackground: CSSProperties["background"];
    selectedOptionColor: CSSProperties["color"];
    unselectedOptionColor: CSSProperties["color"];
  }>;
};

export function CountrySelect({
  name,
  countries,
  theme: selectTheme,
  ...rest
}: CountrySelectProps) {
  const { status } = useFormikContext();
  const [initialized, setInitialized] = useState<boolean>(false);
  const [field, meta, helpers] = useField(name);
  const errorText = meta.error || status?.[name];
  const errorMessage = errorText && meta.touched ? errorText : "";
  const displayError = typeof errorMessage === "string" && errorMessage !== "";
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [countryCode, setCountryCode] = useState<CountryCode | undefined>();

  useEffect(() => {
    if (!initialized && field.value) {
      setCountryCode(field.value as CountryCode);
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
          country={countryCode}
          value={phone}
          onChange={(value) => setPhone((value || "").replace(/\+/g, ""))}
          countries={countries}
          countrySelectComponent={({ iconComponent: Icon, ...props }) => (
            <>
              <div>
                <Select
                  {...rest}
                  {...props}
                  isDisabled={rest.disabled}
                  theme={(theme) => ({
                    ...theme,
                    controlHeight: selectTheme?.controlHeight,
                    borderRadius: selectTheme?.borderRadius || 0,
                    colors: {
                      ...theme.colors,
                      controlHoverBorderColor:
                        selectTheme?.controlHoverBorderColor ||
                        colors.secondary,
                      controlBackground:
                        selectTheme?.controlBackground || colors.lightGrey,
                      controlFocusBorderColor:
                        selectTheme?.controlFocusBorderColor ||
                        colors.secondary,
                      controlUnfocusedBorderColor:
                        selectTheme?.controlUnfocusedBorderColor ||
                        colors.border,
                      selectedOptionBackground:
                        selectTheme?.selectedOptionBackground ||
                        colors.lightGrey,
                      unselectedOptionBackground:
                        selectTheme?.unselectedOptionBackground || colors.white,
                      selectedOptionColor:
                        selectTheme?.selectedOptionColor || colors.secondary,
                      unselectedOptionColor:
                        selectTheme?.unselectedOptionColor || colors.black
                    }
                  })}
                  styles={customStyles}
                  name="countrySelect"
                  value={(props?.options || []).find(
                    (o: SelectDataProps) => o.value === countryCode
                  )}
                  onChange={(o: SelectDataProps) => {
                    setCountryCode(o.value as CountryCode);
                    helpers.setValue(o.label);
                  }}
                  components={{
                    Control: (props) => {
                      const country =
                        (props?.getValue()[0] as any)?.value || null;
                      return (
                        <components.Control {...props}>
                          <ControlGrid>
                            {country ? (
                              <Icon country={country as CountryCode} label="" />
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
          )}
        />
      </PhoneWrapper>
      <Error display={!rest.hideError && displayError} message={errorMessage} />
    </>
  );
}
