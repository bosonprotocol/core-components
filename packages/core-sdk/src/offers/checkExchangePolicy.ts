import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";
import { OfferFieldsFragment } from "../subgraph";

export type CheckExchangePolicyResult = {
  isValid: boolean;
  errors: {
    message: string;
    path: string;
    value: unknown;
  }[];
};

export type YupPropertyDef = {
  title?: string;
  description?: string;
  type: string;
  properties?: {
    [key: string]: YupPropertyDef;
  };
  required?: boolean;
  min?: string | number;
  max?: string | number;
  flags?: string;
  pattern?: string;
  matches?: string;
};

export type CheckExchangePolicyRules = {
  yupSchema: {
    $schema?: string;
    $id?: string;
    title?: string;
    description?: string;
    type: string;
    properties: {
      [key: string]: YupPropertyDef;
    };
  };
  yupConfig: {
    errMessages?: {
      [key: string]: {
        required?: string;
        min?: string;
        max?: string;
        flags?: string;
        pattern?: string;
        matches?: string;
      };
    };
  };
};

export function checkExchangePolicy(
  offerData: OfferFieldsFragment,
  rules: CheckExchangePolicyRules
): CheckExchangePolicyResult {
  const baseSchema: SchemaOf<unknown> = buildYup(
    rules.yupSchema,
    rules.yupConfig
  );
  try {
    baseSchema.validateSync(offerData, { abortEarly: false });
  } catch (e) {
    return {
      isValid: false,
      errors:
        e.inner?.map((error) => {
          return { ...error };
        }) || []
    };
  }
  return {
    isValid: true,
    errors: []
  };
}
