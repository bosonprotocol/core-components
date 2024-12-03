import {
  MOCK_ERC1155_ADDRESS,
  MOCK_ERC20_ADDRESS,
  MOCK_ERC721_ADDRESS,
  createRandomWallet,
  initCoreSDKWithWallet
} from "./utils";
import { Wallet } from "ethers";

const erc721InterfaceId = "0x80ac58cd";
const erc1155InterfaceId = "0xd9b67a26";

jest.setTimeout(60_000);
describe("ERC", () => {
  test.each([
    {
      name: "ERC20",
      address: MOCK_ERC20_ADDRESS,
      supports: false,
      matchesInterfaceId: null,
      interfaceId: erc721InterfaceId
    },
    {
      name: "ERC721",
      address: MOCK_ERC721_ADDRESS,
      supports: true,
      matchesInterfaceId: true,
      interfaceId: erc721InterfaceId
    },
    {
      name: "ERC1155",
      address: MOCK_ERC1155_ADDRESS,
      supports: true,
      matchesInterfaceId: true,
      interfaceId: erc1155InterfaceId
    },
    {
      name: "ERC721",
      address: MOCK_ERC721_ADDRESS,
      supports: true,
      matchesInterfaceId: false,
      interfaceId: erc1155InterfaceId
    },
    {
      name: "ERC1155",
      address: MOCK_ERC1155_ADDRESS,
      supports: true,
      matchesInterfaceId: false,
      interfaceId: erc721InterfaceId
    }
  ])(
    `ERC contract %p supports (or not) erc165 interface`,
    async ({ address, supports, matchesInterfaceId, interfaceId }) => {
      const coreSDK = initCoreSDKWithWallet(createRandomWallet());
      const call = async () =>
        await coreSDK.erc165SupportsInterface({
          contractAddress: address,
          interfaceId
        });
      if (supports) {
        const supportsResult = await call();
        expect(supportsResult).toBe(matchesInterfaceId);
      } else {
        expect(async () => await call()).rejects.toThrow();
      }
    }
  );
});
