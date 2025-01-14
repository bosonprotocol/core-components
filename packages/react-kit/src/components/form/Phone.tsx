/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint @typescript-eslint/no-explicit-any: "off" */
import { useField, useFormikContext } from "formik";
import { GlobeHemisphereWest } from "phosphor-react";
import React, { useCallback, useEffect, useState } from "react";
import type { Country as CountryCode } from "react-phone-number-input";
import PhoneInput, {
  formatPhoneNumberIntl,
  getCountryCallingCode,
  isSupportedCountry,
  isValidPhoneNumber,
  parsePhoneNumber
} from "react-phone-number-input";
import Select, { components } from "react-select";
import styled from "styled-components";
import { colors, getCssVar } from "../../theme";
import { zIndex } from "../ui/zIndex";

import Error from "./Error";
import { FieldInput } from "./Field.styles";
import type { InputProps } from "./types";
import { SelectDataProps } from "./types";
import { useFixSelectFont } from "../../hooks/form/useFixSelectFont";
import { inputStyles } from "./styles";

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
    return {
      ...provided,
      borderRadius: 0,
      padding: "0.4rem 0.25rem",
      boxShadow: "none",
      ":hover": {
        borderColor: colors.violet,
        borderWidth: "1px"
      },
      background: inputStyles.background,
      border: state.isFocused
        ? `1px solid ${colors.violet}`
        : `1px solid ${getCssVar("--border-color")}`,
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
    opacity: state.isDisabled ? "0.5" : "1",
    background:
      state.isOptionSelected || state.isSelected || state.isFocused
        ? colors.greyLight
        : colors.white,
    color:
      state.isOptionSelected || state.isSelected ? colors.violet : colors.black
  }),
  indicatorSeparator: () => ({
    display: "none"
  })
};

export const ControlGrid = styled.div`
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
export const OptionGrid = styled.div`
  font-size: revert;
  display: grid;
  grid-auto-columns: 1fr;
  grid-template-columns: 2em 1fr;
  gap: 0.5rem;
  .PhoneInputCountryIcon img {
    max-width: 30px;
  }
`;

export const PhoneWrapper = styled.div`
  width: 100%;
  padding-bottom: 0.5rem;
  .PhoneInput {
    width: 100%;
    display: grid;
    grid-auto-columns: 1fr;
    grid-template-columns: 14em 1fr;
    gap: 0.5rem;
    align-items: center;
  }
  input {
    width: 100%;
    padding: 1rem;
    gap: 0.5rem;
    background: ${getCssVar("--background-accent-color")};
    border: 1px solid ${getCssVar("--border-color")};
    color: ${getCssVar("--main-text-color")};
    border-radius: 0;
    outline: none;
    font-family: "Plus Jakarta Sans";
    transition: all 150ms ease-in-out;
  }
`;

const handleCountry = () => {
  const countryCode = (navigator?.languages || [])
    .find((language) => language.includes("-"))
    ?.split("-")?.[1]
    ?.toUpperCase() as CountryCode;
  if (isSupportedCountry(countryCode as CountryCode)) return countryCode;
  return undefined;
};

export default function Phone({ name, ...props }: InputProps) {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [countryCode, setCountryCode] = useState<CountryCode | undefined>(
    handleCountry()
  );

  const { status } = useFormikContext();
  const [field, meta, helpers] = useField(name);
  const errorText = meta.error || status?.[name];
  const errorMessage = errorText && meta.touched ? errorText : "";
  const displayError = typeof errorMessage === "string" && errorMessage !== "";

  const handlePhoneChange = useCallback(
    (value: string) => {
      const callingCode = countryCode
        ? getCountryCallingCode(countryCode as CountryCode)
        : false;
      const newValue = formatPhoneNumberIntl(
        `${callingCode ? `+${callingCode}` : ""}${value}`
      );

      if (!isValidPhoneNumber(newValue)) {
        if (!meta.touched) {
          helpers.setTouched(true);
        }
        helpers.setError(
          newValue === ""
            ? "Phone number is required"
            : "Wrong phone number format"
        );
      }
      helpers.setValue(newValue);
    },
    [helpers, countryCode, meta.touched]
  );

  useEffect(() => {
    if (phone !== undefined) {
      handlePhoneChange(phone);
    }
  }, [countryCode, phone]); // eslint-disable-line

  useEffect(() => {
    if (!initialized && field.value) {
      const parsed = parsePhoneNumber(field.value);
      setInitialized(true);
      setPhone(parsed?.nationalNumber || "");
      if (parsed?.country) {
        setCountryCode(parsed?.country as CountryCode);
      }
    }
  }, [field.value, initialized]); // eslint-disable-line

  const { jsx, selectClassName } = useFixSelectFont({
    selectClassName: "phone-select"
  });
  return (
    <>
      {jsx}
      <PhoneWrapper className={selectClassName}>
        {/* @ts-ignore */}
        <PhoneInput
          country={countryCode}
          value={phone}
          onChange={(value) => setPhone((value || "").replace(/\+/g, ""))}
          countrySelectComponent={({ iconComponent: Icon, ...props }) => (
            <>
              <div>
                <Select
                  {...props}
                  styles={customStyles}
                  name="phoneCountry"
                  value={(props?.options || []).find(
                    (o: SelectDataProps) => o.value === countryCode
                  )}
                  onChange={(o: SelectDataProps) =>
                    setCountryCode(o.value as CountryCode)
                  }
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
                            {/* @ts-ignore // TODO: check */}
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
                              <GlobeHemisphereWest
                                width={"22px"}
                                height={"22px"}
                              />
                            )}
                            {props.label}
                          </OptionGrid>
                        </components.Option>
                      );
                    }
                  }}
                  menuPosition="fixed"
                />
              </div>
            </>
          )}
        />
      </PhoneWrapper>
      <FieldInput
        type="hidden"
        $error={errorMessage}
        disabled
        {...field}
        {...props}
      />
      <Error
        display={!props.hideError && displayError}
        message={errorMessage}
      />
    </>
  );
}
