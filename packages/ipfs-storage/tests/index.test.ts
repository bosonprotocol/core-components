import { constants, IpfsMetadata } from "../src/index";

describe("index entrypoint", () => {
  test("export IpfsMetadata", () => {
    expect(IpfsMetadata).toBeTruthy();
  });

  test("export constants", () => {
    expect(constants).toBeTruthy();
  });
});
