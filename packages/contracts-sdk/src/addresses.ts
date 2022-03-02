export type ContractAddresses = {
  protocolDiamond: string;
};

export type ChainAddresses = {
  chainId: number;
  protocolDiamond: string;
};

export const addresses: Record<string, ChainAddresses> = {
  local: {
    chainId: 31337,
    protocolDiamond: "0xad7A37a28923a9534809eEdE6c783a1F22df1c2b"
  },
  testing: {
    chainId: 3,
    protocolDiamond: "0x"
  },
  staging: {
    chainId: 3,
    protocolDiamond: "0x"
  },
  production: {
    chainId: 1,
    protocolDiamond: "0x"
  }
};
