import { ADDRESS, MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";
import {
  withdrawAllAvailableFunds,
  withdrawFunds
} from "../../src/funds/handler";
import { interceptSubgraph, SUBGRAPH_URL } from "../mocks";
import { AddressZero } from "@ethersproject/constants";
import { encodeWithdrawFunds } from "../../src/funds/interface";

describe("#withdrawAllAvailableFunds()", () => {
  test("sends correct transaction data", async () => {
    const [ethTokenAddress, otherTokenAddress] = [
      AddressZero,
      "0x37402cf25f2D82b8490ca0903dA5b62428e5a421"
    ];
    const ethAmount = "10";
    const otherTokenAmount = "100";
    const sellerId = "1";
    const mockWebLibApapter = new MockWeb3LibAdapter();
    interceptSubgraph().reply(200, {
      data: {
        fundsEntities: [
          {
            availableAmount: ethAmount,
            accountId: sellerId,
            token: {
              address: ethTokenAddress
            }
          },
          {
            availableAmount: otherTokenAmount,
            accountId: sellerId,
            token: {
              address: otherTokenAddress
            }
          }
        ]
      }
    });

    await withdrawAllAvailableFunds({
      sellerId: sellerId,
      subgraphUrl: SUBGRAPH_URL,
      contractAddress: ADDRESS,
      web3Lib: mockWebLibApapter
    });

    const expectedTokensToWithdraw = [ethTokenAddress, otherTokenAddress];
    const expectedAmountsToWithdraw = [ethAmount, otherTokenAmount];
    const withdrawFundsTransactionData =
      mockWebLibApapter.sendTransactionArgs[0];
    expect(withdrawFundsTransactionData).toEqual({
      to: ADDRESS,
      data: encodeWithdrawFunds(
        sellerId,
        expectedTokensToWithdraw,
        expectedAmountsToWithdraw
      )
    });
  });
});
