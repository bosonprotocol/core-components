import { CoreSDK, offers } from "../src/index";

test("imports CoreSdk", () => {
  expect(CoreSDK).toBeTruthy();
});

test("imports offers", () => {
  expect(offers).toBeTruthy();
});
