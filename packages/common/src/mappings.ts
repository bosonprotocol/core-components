import { ChainId, Lens, ProtocolConfig, Token } from "./types";

export const chainIdToInfo = new Map<ChainId, ProtocolConfig["nativeCoin"]>([
  [80001, { decimals: "18", name: "Matic", symbol: "MATIC" }],
  [80002, { decimals: "18", name: "Matic", symbol: "MATIC" }],
  [137, { decimals: "18", name: "Matic", symbol: "MATIC" }],
  [1, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [11155111, { decimals: "18", name: "sETH", symbol: "sETH" }],
  [31337, { decimals: "18", name: "Ether", symbol: "ETH" }]
]);

export const chainIdToGraphTx = new Map<
  ChainId,
  (txHash?: string, isAddress?: boolean) => string
>([
  [
    80002,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://www.oklink.com/amoy/address/${txHash}`;
      }
      return `https://www.oklink.com/amoy/tx/${txHash}`;
    }
  ],
  [
    137,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://polygonscan.com/address/${txHash}`;
      }
      return `https://polygonscan.com/tx/${txHash}`;
    }
  ],
  [
    11155111,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://sepolia.etherscan.io/address/${txHash}`;
      }
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    }
  ],
  [
    1,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://etherscan.io/address/${txHash}`;
      }
      return `https://etherscan.io/tx/${txHash}`;
    }
  ],
  [31337, (txHash = "") => `${txHash}`] // TODO: add url
]);

// https://docs.lens.xyz/docs/deployed-contract-addresses
export const chainIdToLensInfo = new Map<ChainId, Lens>([
  [
    137,
    {
      LENS_HUB_CONTRACT: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
      LENS_PERIPHERY_CONTRACT: "0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f",
      LENS_PROFILES_CONTRACT_ADDRESS:
        "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
      LENS_PROFILES_CONTRACT_PARTIAL_ABI:
        '[{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"}]',
      apiLink: "https://api.lens.dev"
    }
  ]
]);

export const chainIdToDefaultTokens = new Map<ChainId, Token[]>([
  [
    31337,
    [
      {
        symbol: "MATIC",
        name: "MATIC",
        address: "0x0000000000000000000000000000000000000000",
        decimals: "18"
      },
      {
        symbol: "TETH",
        name: "testErc20",
        address: "0x851356ae760d987E095750cCeb3bC6014560891C",
        decimals: "18"
      }
    ]
  ],
  [
    80002,
    [
      {
        symbol: "MATIC",
        name: "MATIC",
        address: "0x0000000000000000000000000000000000000000",
        decimals: "18"
      },
      {
        symbol: "WETH",
        name: "Wrapped Ether",
        address: "0x????????????????????????????????????????", // TODO: to be defined
        decimals: "18"
      },
      {
        symbol: "BOSON",
        name: "Boson Token (PoS)",
        address: "0x94e32c4bfcA1D3fe08B6F8252ABB47A5B14AC2bD",
        decimals: "18"
      },
      {
        symbol: "USDC",
        name: "Mumbai USD Coin",
        address: "0x????????????????????????????????????????", // TODO: to be defined
        decimals: "6"
      },
      {
        symbol: "DAI",
        name: "DAI",
        address: "0x????????????????????????????????????????", // TODO: to be defined
        decimals: "18"
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0x????????????????????????????????????????", // TODO: to be defined
        decimals: "6"
      }
    ]
  ],
  [
    11155111,
    [
      {
        symbol: "ETH",
        name: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: "18"
      },
      {
        symbol: "BOSON",
        name: "Boson Token (PoS)",
        address: "0x791Bf9Da3DEF5D7Cd3A7a748e56720Cd119D53AC",
        decimals: "18"
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5",
        decimals: "6"
      },
      {
        symbol: "DAI",
        name: "Dai Stablecoin",
        address: "0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6",
        decimals: "18"
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
        decimals: "6"
      }
    ]
  ],
  [
    137,
    [
      {
        symbol: "MATIC",
        name: "MATIC",
        address: "0x0000000000000000000000000000000000000000",
        decimals: "18"
      },
      {
        symbol: "WETH",
        name: "Wrapped Ether",
        address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        decimals: "18"
      },
      {
        symbol: "BOSON",
        name: "Boson Token (PoS)",
        address: "0x9B3B0703D392321AD24338Ff1f846650437A43C9",
        decimals: "18"
      },
      {
        symbol: "USDC",
        name: "USD Coin (PoS)",
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        decimals: "6"
      },
      {
        symbol: "DAI",
        name: "(PoS) Dai Stablecoin",
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        decimals: "18"
      },
      {
        symbol: "USDT",
        name: "(PoS) Tether USD",
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        decimals: "6"
      }
    ]
  ],
  [
    1,
    [
      {
        symbol: "ETH",
        name: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: "18"
      },
      {
        symbol: "BOSON",
        name: "Boson Token",
        address: "0xC477D038d5420C6A9e0b031712f61c5120090de9",
        decimals: "18"
      },
      {
        symbol: "USDC",
        name: "USDC",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: "6"
      },
      {
        symbol: "DAI",
        name: "Dai Stablecoin",
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        decimals: "18"
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: "6"
      }
    ]
  ]
]);
