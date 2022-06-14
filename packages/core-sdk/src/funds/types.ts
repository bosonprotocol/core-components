export type RawFundsEntityFromSubgraph = {
  id: string;
  availableAmount: string;
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  accountId: string;
};
