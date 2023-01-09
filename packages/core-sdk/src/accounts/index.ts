import { utils } from "@bosonprotocol/common";

export * as iface from "./interface";
export * as handler from "./handler";
export * as subgraph from "./subgraph";
export * from "./types";

export const validation: {
  createSellerArgsSchema: typeof utils.validation.createSellerArgsSchema;
} = {
  createSellerArgsSchema: utils.validation.createSellerArgsSchema
};
