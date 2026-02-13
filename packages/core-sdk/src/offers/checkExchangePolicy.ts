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

/**
 * Helper function to safely extract validation errors from a Yup ValidationError.
 * 
 * @param error - The error object to extract validation errors from
 * @returns An array of error objects, each containing:
 *   - message: The error message string
 *   - path: The path to the invalid field
 *   - value: The invalid value
 * 
 * Returns an empty array if:
 * - The error is not a valid Yup ValidationError
 * - The error doesn't have an `inner` property
 * - The `inner` property is not an array
 */
function extractValidationErrors(error: unknown): Array<{ message: string; path: string; value: unknown }> {
  if (error && typeof error === "object" && "inner" in error && Array.isArray(error.inner)) {
    return error.inner.map((e: unknown) => {
      // Extract only the needed properties from the error object
      if (e && typeof e === "object") {
        return {
          message: "message" in e ? String(e.message) : "",
          path: "path" in e ? String(e.path) : "",
          value: "value" in e ? e.value : undefined
        };
      }
      return { message: "", path: "", value: undefined };
    });
  }
  return [];
}

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
    const rulesTemplate = rules.yupSchemas?.find(
      (schema) => schema.metadataType === metadataType
    );

    if (!rulesTemplate) {
      return {
        isValid: false,
        errors: [
          {
            message: `Unsupported metadata type: ${String(metadataType)}`,
            path: "metadata.type",
            value: metadataType
          }
        ]
      };
    }

    baseSchema = buildYup(rulesTemplate, rules.yupConfig);
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
      errors: extractValidationErrors(e)
    };
  }
  if (metadataType === "BUNDLE") {
    // For BUNDLE metadata, check each item in the bundle
    const bundleItems =
      (offerData.metadata as { items?: { type?: string }[] })?.items || [];
    if (bundleItems.length === 0) {
      // An empty bundle is semantically invalid
      result.isValid = false;
      result.errors = result.errors.concat([
        {
          message: "Bundle metadata must contain at least one item.",
          path: "metadata.items",
          value: bundleItems
        }
      ]);
    } else {
      for (const item of bundleItems) {
        const itemType = item.type;
        const itemRulesTemplate = Array.isArray(rules.yupSchemas)
          ? rules.yupSchemas.find((schema) => schema.metadataType === itemType)
          : undefined;
        const itemSchema = itemRulesTemplate
          ? buildYup(itemRulesTemplate, rules.yupConfig)
          : undefined;
        if (itemSchema) {
          try {
            itemSchema.validateSync(item, { abortEarly: false });
          } catch (e) {
            result.isValid = false;
            result.errors = result.errors.concat(extractValidationErrors(e));
          }
        }
      }
    }
    // Ensure bundle contains at least one ITEM_PRODUCT_V1 item,
    // as required by the UI logic to extract exchange policy and shipping data.
    const hasRequiredProductItem = bundleItems.some(
      (item) => item.type === "ITEM_PRODUCT_V1"
    );
    if (!hasRequiredProductItem) {
      result.isValid = false;
      result.errors = result.errors.concat({
        message:
          "Bundle metadata must contain at least one ITEM_PRODUCT_V1 item to provide exchange policy and shipping information.",
        path: "metadata.items",
        value: bundleItems
      });
    }
  }
  return result;
}
