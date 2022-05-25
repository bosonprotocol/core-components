import { validateMetadata, AnyMetadata } from "../src/index";

describe("#validateMetadata()", () => {
  test("throw for invalid type", () => {
    expect(() =>
      validateMetadata({
        type: "invalid"
      } as any as AnyMetadata)
    ).toThrow();
  });

  describe("BASE", () => {
    test("throw for invalid object", () => {
      expect(() =>
        validateMetadata({
          type: "BASE"
        } as any as AnyMetadata)
      ).toThrow();
    });

    test("not throw for valid object", () => {
      expect(
        validateMetadata({
          name: "name",
          description: "description",
          externalUrl: "example.com",
          schemaUrl: "example.com",
          type: "BASE"
        })
      ).toBeTruthy();
    });
  });
});
