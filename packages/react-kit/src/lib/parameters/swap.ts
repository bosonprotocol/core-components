export const swapQueryParameters = {
  inputCurrency: "inputCurrency",
  outputCurrency: "outputCurrency",
  exactAmount: "exactAmount",
  exactField: "exactField"
} as const;

export enum Field {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT"
}
