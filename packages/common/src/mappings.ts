import { ChainId, Lens, ProtocolConfig, Token } from "./types";

export const chainIdToInfo = new Map<ChainId, ProtocolConfig["nativeCoin"]>([
  [80001, { decimals: "18", name: "Matic", symbol: "MATIC" }],
  [137, { decimals: "18", name: "Matic", symbol: "MATIC" }],
  [1, { decimals: "18", name: "Ether", symbol: "ETH" }],
  [5, { decimals: "18", name: "GTH", symbol: "GTH" }],
  [31337, { decimals: "18", name: "Ether", symbol: "ETH" }]
]);

export const chainIdToGraphTx = new Map<
  ChainId,
  (txHash?: string, isAddress?: boolean) => string
>([
  [
    80001,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://mumbai.polygonscan.com/address/${txHash}`;
      }
      return `https://mumbai.polygonscan.com/tx/${txHash}`;
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
    5,
    (txHash = "", isAddress = false) => {
      if (isAddress) {
        return `https://goerli.etherscan.io/address/${txHash}`;
      }
      return `https://goerli.etherscan.io/tx/${txHash}`;
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
    80001,
    {
      LENS_HUB_CONTRACT: "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82",
      LENS_PERIPHERY_CONTRACT: "0xD5037d72877808cdE7F669563e9389930AF404E8",
      LENS_PROFILES_CONTRACT_ADDRESS:
        "0x60ae865ee4c725cd04353b5aab364553f56cef82",
      LENS_PROFILES_CONTRACT_PARTIAL_ABI:
        '[{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"}]',
      apiLink: "https://api-mumbai.lens.dev/",
      ipfsGateway: "https://lens.infura-ipfs.io/ipfs/"
    }
  ],
  [
    137,
    {
      LENS_HUB_CONTRACT: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
      LENS_PERIPHERY_CONTRACT: "0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f",
      LENS_PROFILES_CONTRACT_ADDRESS:
        "0xdb46d1dc155634fbc732f92e853b10b288ad5a1d",
      LENS_PROFILES_CONTRACT_PARTIAL_ABI:
        '[{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"}]',
      apiLink: "https://api.lens.dev",
      ipfsGateway: "https://lens.infura-ipfs.io/ipfs/"
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
        address: "0x998abeb3E57409262aE5b751f60747921B33613E",
        decimals: "18"
      }
    ]
  ],
  [
    80001,
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
        address: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
        decimals: "18"
      },
      {
        symbol: "BOSON",
        name: "Boson Token (PoS)",
        address: "0x1f5431E8679630790E8EbA3a9b41d1BB4d41aeD0",
        decimals: "18"
      },
      {
        symbol: "USDC",
        name: "Mumbai USD Coin",
        address: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
        decimals: "6"
      },
      {
        symbol: "DAI",
        name: "DAI",
        address: "0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f",
        decimals: "18"
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832",
        decimals: "6"
      }
    ]
  ],
  [
    5,
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
        address: "0xe3c811abbd19fbb9fe324eb0f30f32d1f6d20c95",
        decimals: "18"
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
        decimals: "6"
      },
      {
        symbol: "DAI",
        name: "Dai Stablecoin",
        address: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
        decimals: "18"
      },
      {
        symbol: "USDT",
        name: "Tether USD",
        address: "0xfad6367E97217cC51b4cd838Cc086831f81d38C2",
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
