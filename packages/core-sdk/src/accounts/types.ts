export { CreateSellerArgs } from "@bosonprotocol/common";

export type RawSellerFromSubgraph = {
  id: string;
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
  active: boolean;
};
