import type { TokenList } from "@uniswap/token-lists";
import type { ValidateFunction } from "ajv";
// @ts-expect-error TODO: this should be imported async but it doesnt work in storybook
import validatorImportList from "./__generated__/validateTokenList";
// @ts-expect-error TODO: this should be imported async but it doesnt work in storybook
import validateTokens from "./__generated__/validateTokens";

enum ValidationSchema {
  LIST = "list",
  TOKENS = "tokens"
}

function getValidationErrors(validate: ValidateFunction | undefined): string {
  return (
    validate?.errors
      ?.map((error) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        [error.instancePath, error.message].filter(Boolean).join(" ")
      )
      .join("; ") ?? "unknown error"
  );
}

async function validate(
  schema: ValidationSchema,
  data: unknown
): Promise<unknown> {
  let validatorImport;
  switch (schema) {
    case ValidationSchema.LIST:
      // validatorImport = await import(
      //   "lib/uniswap/__generated__/validateTokenList"
      // );
      validatorImport = validatorImportList;
      break;
    case ValidationSchema.TOKENS:
      // validatorImport = await import(
      //   "lib/uniswap/__generated__/validateTokens"
      // );
      validatorImport = validateTokens;
      break;
    default:
      throw new Error("No validation function specified for token list schema");
  }
  const [,/*validatorModule*/] = await Promise.all([
    import("ajv")
    // validatorImport
  ]);
  // const validator = validatorModule.default as ValidateFunction;
  const validator = validatorImport as ValidateFunction;
  if (validator?.(data)) {
    return data;
  }
  throw new Error(getValidationErrors(validator));
}

/**
 * Validates a token list.
 * @param json the TokenList to validate
 */
export async function validateTokenList(json: TokenList): Promise<TokenList> {
  try {
    await validate(ValidationSchema.LIST, json);
    return json;
  } catch (error) {
    throw new Error(
      `Token list failed validation: ${(error as Error).message}`
    );
  }
}
