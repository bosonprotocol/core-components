import React from "react";
import { useBreakpoints } from "../../../../../hooks/useBreakpoints";
import { Button } from "../../../../buttons/Button";
import Input from "../../../../form/Input";
import Phone from "../../../../form/Phone";
import { Grid } from "../../../../ui/Grid";
import { Typography } from "../../../../ui/Typography";
import { FormModel } from "../RedeemFormModel";
import { CountrySelect } from "../../../../form/CountrySelect";
import type { Country as CountryCode } from "react-phone-number-input";
interface Props {
  isValid: boolean;
  onNextClick: () => void;
  onBackClick: () => void;
}

// https://www.fatf-gafi.org/en/countries.html
const fatfMemberCountries: CountryCode[] = [
  "AR",
  "AU",
  "AT",
  "BE",
  "BR",
  "CA",
  "CN",
  "DK",
  "FI",
  "FR",
  "DE",
  "GR",
  "HK",
  "IS",
  "IN",
  "IE",
  "IL",
  "IT",
  "JP",
  "KR",
  "LU",
  "MY",
  "MX",
  "NE",
  "NZ",
  "PT",
  "NO",
  "SA",
  "SG",
  "ZA",
  "ES",
  "SE",
  "CH",
  "TR",
  "GB",
  "US"
];

export default function RedeemForm({
  isValid,
  onNextClick,
  onBackClick
}: Props) {
  const { isLteXS } = useBreakpoints();
  return (
    <>
      <Typography
        fontWeight="600"
        fontSize="1rem"
        lineHeight="1.5rem"
        margin="0 0 1rem 0"
      >
        Input your address
      </Typography>
      <Grid flexDirection="column" gap="0.5rem">
        <Grid flexDirection="column" alignItems="flex-start">
          <Input
            name={FormModel.formFields.name.name}
            placeholder={FormModel.formFields.name.placeholder}
          />
        </Grid>
        <Grid flexDirection="column" alignItems="flex-start">
          <Input
            name={FormModel.formFields.streetNameAndNumber.name}
            placeholder={FormModel.formFields.streetNameAndNumber.placeholder}
          />
        </Grid>
        <Grid flexDirection="column" alignItems="flex-start">
          <Input
            name={FormModel.formFields.city.name}
            placeholder={FormModel.formFields.city.placeholder}
          />
        </Grid>

        {isLteXS ? (
          <Grid flexDirection="column" gap="0.5rem">
            <Grid flexDirection="column" alignItems="flex-start">
              <Input
                name={FormModel.formFields.state.name}
                placeholder={FormModel.formFields.state.placeholder}
              />
            </Grid>
            <Grid flexDirection="column" alignItems="flex-start">
              <Input
                name={FormModel.formFields.zip.name}
                placeholder={FormModel.formFields.zip.placeholder}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid flexDirection="row" gap="0.5rem">
            <Grid
              flexDirection="column"
              alignItems="flex-start"
              flexBasis="75%"
            >
              <Input
                name={FormModel.formFields.state.name}
                placeholder={FormModel.formFields.state.placeholder}
              />
            </Grid>
            <Grid
              flexDirection="column"
              alignItems="flex-start"
              flexBasis="25%"
            >
              <Input
                name={FormModel.formFields.zip.name}
                placeholder={FormModel.formFields.zip.placeholder}
              />
            </Grid>
          </Grid>
        )}
        <Grid flexDirection="column" alignItems="flex-start">
          <CountrySelect
            name={FormModel.formFields.country.name}
            placeholder={FormModel.formFields.country.placeholder}
            countries={fatfMemberCountries}
          />
        </Grid>
        <Grid flexDirection="column" alignItems="flex-start">
          <Input
            name={FormModel.formFields.email.name}
            placeholder={FormModel.formFields.email.placeholder}
          />
        </Grid>
        <Grid flexDirection="column" alignItems="flex-start">
          <Phone
            name={FormModel.formFields.phone.name}
            placeholder={FormModel.formFields.phone.placeholder}
          />
        </Grid>
      </Grid>
      <Grid padding="2rem 0 0 0" justifyContent="space-between">
        <Button
          variant="primaryFill"
          onClick={() => onNextClick()}
          disabled={!isValid}
        >
          Next
        </Button>
        <Button variant="secondaryInverted" onClick={() => onBackClick()}>
          Back
        </Button>
      </Grid>
    </>
  );
}
