import { ChainId, Lens, ProtocolConfig, Token } from "./types";

export const chainIdToInfo = new Map<ChainId, ProtocolConfig["nativeCoin"]>([
  [80002, { decimals: "18", name: "Matic", symbol: "MATIC" }],
  [137, { decimals: "18", name: "Matic", symbol: "MATIC" }],
  [1, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [10, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [42161, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [11155111, { decimals: "18", name: "sETH", symbol: "sETH" }],
  [31337, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [84532, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [8453, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [11155420, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [421614, { decimals: "18", name: "Ether", symbol: "ETH" }]
]);

export const chainIdToGraphTx = new Map<
  ChainId,
  (txHash?: string, isAddress?: boolean) => string
>([
  [
    80002,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://amoy.polygonscan.com/address/${txHash}`;
      }
      return `https://amoy.polygonscan.com/tx/${txHash}`;
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
  [
    8453,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://basescan.org/address/${txHash}`;
      }
      return `https://basescan.org/tx/${txHash}`;
    }
  ],
  [
    10,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://optimistic.etherscan.io/address/${txHash}`;
      }
      return `https://optimistic.etherscan.io/tx/${txHash}`;
    }
  ],
  [
    84532,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://sepolia.basescan.org/address/${txHash}`;
      }
      return `https://sepolia.basescan.org/tx/${txHash}`;
    }
  ],
  [
    11155420,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://sepolia-optimistic.etherscan.io/address/${txHash}`;
      }
      return `https://sepolia-optimistic.etherscan.io/tx/${txHash}`;
    }
  ],
  [
    42161,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://arbiscan.io/address/${txHash}`;
      }
      return `https://arbiscan.io/tx/${txHash}`;
    }
  ],
  [
    421614,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://sepolia.arbiscan.io/address/${txHash}`;
      }
      return `https://sepolia.arbiscan.io/tx/${txHash}`;
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
        symbol: "WETH",
        name: "testErc20",
        address: "0x998abeb3E57409262aE5b751f60747921B33613E",
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
        address: "0x52eF3d68BaB452a294342DC3e5f464d7f610f72E",
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
        name: "Amoy USD Coin",
        address: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
        decimals: "6"
      }
      // {
      //   symbol: "DAI",
      //   name: "DAI",
      //   address: "0x????????????????????????????????????????", // TODO: to be defined
      //   decimals: "18"
      // },
      // {
      //   symbol: "USDT",
      //   name: "Tether USD",
      //   address: "0x????????????????????????????????????????", // TODO: to be defined
      //   decimals: "6"
      // }
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
        symbol: "WETH",
        name: "Wrapped Ether",
        address: "0x7b79995e5f793a07bc00c21412e50ecae098e7f9",
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
    84532,
    [
      {
        symbol: "ETH",
        name: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: "18"
      },
      {
        symbol: "WETH",
        name: "Wrapped Ether",
        address: "0x4200000000000000000000000000000000000006",
        decimals: "18"
      },
      {
        symbol: "BOSON",
        name: "Boson Token (PoS)",
        address: "0xd4857D5e326eee33d7bC5d2494524Dab65d55851",
        decimals: "18"
      },
      {
        symbol: "USDC",
        name: "USD Base Coin",
        address: "0x8A04d904055528a69f3E4594DDA308A31aeb8457",
        decimals: "6"
      }
    ]
  ],
  [
    11155420,
    [
      {
        symbol: "ETH",
        name: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: "18"
      },
      {
        symbol: "WETH",
        name: "Wrapped Ether",
        address: "0x4200000000000000000000000000000000000006",
        decimals: "18"
      },
      {
        symbol: "BOSON",
        name: "Boson Token (PoS)",
        address: "0xe8637906721051d860af222e6021826887d9e358",
        decimals: "18"
      }
    ]
  ],
  [
    421614,
    [
      {
        symbol: "ETH",
        name: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: "18"
      },
      {
        symbol: "WETH",
        name: "Wrapped Ether",
        address: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
        decimals: "18"
      },
      {
        symbol: "BOSON",
        name: "Boson Token",
        address: "0x9Aa2Be49567a2C86b30c703662E376146deD9B32",
        decimals: "18"
      }
    ]
  ],
  [
    42161,
    [
      {
        symbol: "ETH",
        name: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: "18"
      },
      {
        symbol: "WETH",
        name: "Wrapped Ether",
        address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        decimals: "18"
      },
      {
        symbol: "BOSON",
        name: "Boson Token",
        address: "0x54B334d68cf5382feE7FBBE496FCf1e76D9BA000",
        decimals: "18"
      }
    ]
  ],
  [
    8453,
    [
      {
        symbol: "ETH",
        name: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: "18"
      },
      {
        symbol: "WETH",
        name: "Wrapped Ether",
        address: "0x4200000000000000000000000000000000000006",
        decimals: "18"
      },
      {
        symbol: "BOSON",
        name: "Boson Token (PoS)",
        address: "0x2192607C3CBA9Ec3D490206d10d831E68E5F3c97",
        decimals: "18"
      },
      {
        symbol: "USDC",
        name: "USD Base Coin",
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        decimals: "6"
      }
    ]
  ],
  [
    10,
    [
      {
        symbol: "ETH",
        name: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: "18"
      },
      {
        symbol: "WETH",
        name: "Wrapped Ether",
        address: "0x4200000000000000000000000000000000000006",
        decimals: "18"
      },
      {
        symbol: "BOSON",
        name: "Boson Token (PoS)",
        address: "0x647fE0cCA3DF596ba414C8c600D441BB3D10d616",
        decimals: "18"
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
        symbol: "WETH",
        name: "Wrapped Ether",
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
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
