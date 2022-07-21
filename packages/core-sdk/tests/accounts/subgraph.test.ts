import { getSellerByAddress } from "../../src/accounts/subgraph";
import { ADDRESS } from "@bosonprotocol/common/tests/mocks";
import {
  SUBGRAPH_URL,
  interceptSubgraph,
  mockRawSellerFromSubgraph
} from "../mocks";

describe("#getSellerByAddress()", () => {
  test("return falsy if address no seller", async () => {
    interceptSubgraph()
      .times(4)
      .reply(200, {
        data: {
          sellers: []
        }
      });

    const rawSeller = await getSellerByAddress(SUBGRAPH_URL, ADDRESS);

    expect(rawSeller).toBeFalsy();
  });
  test("return seller if address is operator", async () => {
    const mockedRawSellerFromSubgraph = mockRawSellerFromSubgraph({
      operator: ADDRESS
    });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: [mockedRawSellerFromSubgraph]
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });

    const rawSeller = await getSellerByAddress(SUBGRAPH_URL, ADDRESS);

    expect(rawSeller).toMatchObject(mockedRawSellerFromSubgraph);
  });

  test("return seller if address is admin", async () => {
    const mockedRawSellerFromSubgraph = mockRawSellerFromSubgraph({
      admin: ADDRESS
    });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: [mockedRawSellerFromSubgraph]
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });

    const rawSeller = await getSellerByAddress(SUBGRAPH_URL, ADDRESS);

    expect(rawSeller).toMatchObject(mockedRawSellerFromSubgraph);
  });

  test("return seller if address is clerk", async () => {
    const mockedRawSellerFromSubgraph = mockRawSellerFromSubgraph({
      clerk: ADDRESS
    });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: [mockedRawSellerFromSubgraph]
        }
      });
    interceptSubgraph()
      .times(1)
      .reply(200, {
        data: {
          sellers: []
        }
      });

    const rawSeller = await getSellerByAddress(SUBGRAPH_URL, ADDRESS);

    expect(rawSeller).toMatchObject(mockedRawSellerFromSubgraph);
  });
});
