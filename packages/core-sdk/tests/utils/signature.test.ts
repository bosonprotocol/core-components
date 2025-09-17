import {
  getSignatureParameters,
  rebuildSignature
} from "../../src/utils/signature";

describe("signature utils", () => {
  // minimal test to check that the function runs without error
  test("getSignatureParameters()", () => {
    const signature =
      "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a1b";
    const { r, s, v, signature: sig } = getSignatureParameters(signature);
    expect(r).toBe(
      "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392"
    );
    expect(s).toBe(
      "0x024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a"
    );
    expect(v).toBe(27);
    expect(sig).toBe(signature);
  });

  test("getSignatureParameters() - support Ledger signature", () => {
    const signature =
      "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a01";
    const { r, s, v, signature: sig } = getSignatureParameters(signature);
    expect(r).toBe(
      "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392"
    );
    expect(s).toBe(
      "0x024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a"
    );
    expect(v).toBe(28);
    expect(sig).toBe(signature);
  });

  test("getSignatureParameters() errors - signature is not a valid hex string", () => {
    const signature =
      "0xzz93bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a1b";
    expect(() => getSignatureParameters(signature)).toThrow(
      "not a valid hex string"
    );
  });

  test("getSignatureParameters() errors - v is not a number", () => {
    const signature =
      "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a";
    const { r, s, v, signature: sig } = getSignatureParameters(signature);
    expect(r).toBe(
      "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392"
    );
    expect(s).toBe(
      "0x024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a"
    );
    expect(isNaN(v)).toBe(true);
    expect(sig).toBe(signature);
  });

  test("rebuildSignature()", () => {
    const r =
      "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392";
    const s =
      "0x024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a";
    const v = 27;
    const signature =
      "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a1b";
    const sig = rebuildSignature({ r, s, v });
    expect(sig).toBe(signature);
  });

  test("rebuildSignature() errors - r is not a valid hex string", () => {
    const r =
      "0xz093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392";
    const s =
      "0x024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a";
    const v = 27;
    expect(() => rebuildSignature({ r, s, v })).toThrow(
      "r and s must be valid hex strings"
    );
  });

  test("rebuildSignature() errors - s is not a valid hex string", () => {
    const r =
      "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392";
    const s =
      "0xz24b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a";
    const v = 27;
    expect(() => rebuildSignature({ r, s, v })).toThrow(
      "r and s must be valid hex strings"
    );
  });
});
