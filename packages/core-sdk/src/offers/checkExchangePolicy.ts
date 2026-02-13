import { buildYup } from "schema-to-yup";
import { Schema } from "yup";
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
  // Keep default type for backward compatibility, but also support multiple schemas for different metadata types (e.g., PRODUCT_V1 and BUNDLE)
  yupSchema: {
    $schema?: string;
    $id?: string;
    title?: string;
    description?: string;
    type: string;
    metadataType?: string;
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
  // Extend the type to support multiple schemas (for different metadata types, e.g., PRODUCT_V1 and BUNDLE)
  yupSchemas?: {
    $schema?: string;
    $id?: string;
    title?: string;
    description?: string;
    type: string;
    metadataType: string;
    properties: {
      [key: string]: YupPropertyDef;
    };
  }[];
};

export function checkExchangePolicy(
  offerData: OfferFieldsFragment,
  rules: CheckExchangePolicyRules
): CheckExchangePolicyResult {
  let baseSchema: Schema<unknown>;

  const metadataType = offerData.metadata?.type;

  if (
    !rules.yupSchema.metadataType ||
    metadataType === rules.yupSchema.metadataType
  ) {
    baseSchema = buildYup(rules.yupSchema, rules.yupConfig);
  } else {
    // For multiple schemas, use the one matching metadata.type
    const rulesTemplate = rules.yupSchemas.find(
      (schema) => schema.metadataType === metadataType
    );
    baseSchema = rulesTemplate
      ? buildYup(rulesTemplate, rules.yupConfig)
      : buildYup(rules.yupSchema, rules.yupConfig); // fallback to default schema if no matching metadataType found
  }

  let result = {
    isValid: true,
    errors: []
  };
  try {
    baseSchema.validateSync(offerData, { abortEarly: false });
  } catch (e) {
    result = {
      isValid: false,
      errors:
        e.inner?.map((error) => {
          return { ...error };
        }) || []
    };
  }
  if (metadataType === "BUNDLE") {
    try {
      // For BUNDLE metadata, check each item in the bundle
      const bundleItems = (
        offerData.metadata as { items?: { type?: string }[] }
      )?.items;
      for (const item of bundleItems) {
        const itemType = item.type;
        const itemRulesTemplate = Array.isArray(rules.yupSchemas)
          ? rules.yupSchemas.find((schema) => schema.metadataType === itemType)
          : undefined;
        const itemSchema = itemRulesTemplate
          ? buildYup(itemRulesTemplate, rules.yupConfig)
          : undefined;
        if (itemSchema) {
          itemSchema.validateSync(item, { abortEarly: false });
        }
      }
    } catch (e) {
      result.isValid = false;
      result.errors = result.errors.concat(
        e.inner?.map((error) => {
          return { ...error };
        }) || []
      );
    }
  }
  return result;
}
