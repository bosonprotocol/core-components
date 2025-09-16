import { MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";
import { signMetaTxResolveDispute } from "../../src/meta-tx/handler";

describe("meta-tx handler", () => {
  describe("#signMetaTxResolveDispute()", () => {
    const counterpartySignature = {
      signature:
        "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a1b",
      r: "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392",
      s: "0x024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a1b",
      v: 27
    };
    const expectedSignedMetaTx = {
      signature:
        "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a1b",
      r: "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd",
      s: "0x72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a",
      v: 27
    };
    test("call with string format signature", async () => {
      const signedMetaTx = await signMetaTxResolveDispute({
        chainId: 31337,
        metaTxHandlerAddress: "0x0000000000000000000000000000000000000000",
        nonce: 1,
        web3Lib: new MockWeb3LibAdapter({
          getSignerAddress: "0x0000000000000000000000000000000000000001",
          send: expectedSignedMetaTx.signature
        }),
        exchangeId: 1,
        buyerPercent: 10,
        counterpartySig: counterpartySignature.signature
      });
      expect(signedMetaTx.r).toEqual(expectedSignedMetaTx.r);
      expect(signedMetaTx.s).toEqual(expectedSignedMetaTx.s);
      expect(signedMetaTx.v).toEqual(expectedSignedMetaTx.v);
    });
    test("call with {r,s,v} format signature", async () => {
      const signedMetaTx = await signMetaTxResolveDispute({
        chainId: 31337,
        metaTxHandlerAddress: "0x0000000000000000000000000000000000000000",
        nonce: 1,
        web3Lib: new MockWeb3LibAdapter({
          getSignerAddress: "0x0000000000000000000000000000000000000001",
          send: expectedSignedMetaTx.signature
        }),
        exchangeId: 1,
        buyerPercent: 10,
        counterpartySig: {
          r: counterpartySignature.r,
          s: counterpartySignature.s,
          v: counterpartySignature.v
        }
      });
      expect(signedMetaTx.r).toEqual(expectedSignedMetaTx.r);
      expect(signedMetaTx.s).toEqual(expectedSignedMetaTx.s);
      expect(signedMetaTx.v).toEqual(expectedSignedMetaTx.v);
    });
  });
});
