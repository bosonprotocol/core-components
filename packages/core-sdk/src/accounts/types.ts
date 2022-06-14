import { RawFundsEntityFromSubgraph } from "../funds/types";

export { CreateSellerArgs } from "@bosonprotocol/common";

export type RawSellerFromSubgraph = {
  id: string;
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
  active: boolean;
  funds: Omit<RawFundsEntityFromSubgraph, "id" | "accountId">[];
};
