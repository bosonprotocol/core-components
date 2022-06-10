import { constants, IpfsMetadataStorage } from "../src/index";

describe("index entrypoint", () => {
  test("export IpfsMetadataStorage", () => {
    expect(IpfsMetadataStorage).toBeTruthy();
  });

  test("export constants", () => {
    expect(constants).toBeTruthy();
  });
});
