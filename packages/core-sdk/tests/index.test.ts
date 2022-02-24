import { CoreSdk, ContractsSdk } from "../src/index";

test("imports CoreSdk", () => {
  expect(CoreSdk).toBeTruthy();
});

test("imports ContractsSdk", () => {
  expect(ContractsSdk).toBeTruthy();
});
