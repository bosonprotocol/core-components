import * as Yup from "yup";
import { FormModel } from "./RedeemFormModel";
import { ethers } from "ethers";

export enum ProfileType {
  LENS = "lens",
  REGULAR = "regular"
}

export enum ContactPreference {
  XMTP = "xmtp",
  XMTP_AND_EMAIL = "xmtp_and_email"
}

export const getRedeemFormValidationSchema = ({
  emailPreference,
  requestBuyerAddress
}: {
  emailPreference: boolean;
  requestBuyerAddress: boolean;
}) => {
  return Yup.object({
    [FormModel.formFields.name.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.name.requiredErrorMessage),
    [FormModel.formFields.streetNameAndNumber.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.streetNameAndNumber.requiredErrorMessage),
    [FormModel.formFields.city.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.city.requiredErrorMessage),
    [FormModel.formFields.state.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.state.requiredErrorMessage),
    [FormModel.formFields.zip.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.zip.requiredErrorMessage),
    [FormModel.formFields.country.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.country.requiredErrorMessage),
    [FormModel.formFields.email.name]: emailPreference
      ? Yup.string()
          .trim()
          .required(FormModel.formFields.email.requiredErrorMessage)
          .email(FormModel.formFields.email.mustBeEmail)
      : Yup.string().trim().email(FormModel.formFields.email.mustBeEmail),
    [FormModel.formFields.walletAddress.name]: requestBuyerAddress
      ? Yup.string()
          .trim()
          .required(FormModel.formFields.walletAddress.requiredErrorMessage)
          .test(
            "mustBeAddress",
            FormModel.formFields.walletAddress.mustBeWalletAddress,
            (value) => (value ? ethers.utils.isAddress(value) : true)
          )
      : Yup.string().trim(),
    [FormModel.formFields.phone.name]: Yup.string()
      .trim()
      .required(FormModel.formFields.phone.requiredErrorMessage)
  });
};
