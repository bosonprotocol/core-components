import { IpfsMetadataStorage } from "../src/index";

describe("index entrypoint", () => {
  test("export IpfsMetadataStorage", () => {
    expect(IpfsMetadataStorage).toBeTruthy();
  });
});
