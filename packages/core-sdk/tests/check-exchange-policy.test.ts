import { offers } from "../src";
import invalidOffer1 from "./exchangePolicy/examples/invalidOffer1.json";
import invalidOffer2 from "./exchangePolicy/examples/invalidOffer2.json";
import invalidOffer3 from "./exchangePolicy/examples/invalidOffer3.json";
import invalidOffer4 from "./exchangePolicy/examples/invalidOffer4.json";
import invalidOffer5 from "./exchangePolicy/examples/invalidOffer5.json";
import validOffer from "./exchangePolicy/examples/validOffer.json";
import validBundle from "./exchangePolicy/examples/validBundle.json";
import invalidBundle from "./exchangePolicy/examples/invalidBundle.json";
import exchangePolicyRules from "./exchangePolicy/exchangePolicyRules.testing.json";
import { OfferFieldsFragment } from "../src/subgraph";

describe("test check exchange policy", () => {
  test("test check exchange policy with validOffer data", () => {
    const result = offers.checkExchangePolicy(
      validOffer as OfferFieldsFragment,
      exchangePolicyRules
    );
    expect(result.isValid).toBe(true);
  });
  test("test check exchange policy with validBundle data", () => {
    const result = offers.checkExchangePolicy(
      validBundle as OfferFieldsFragment,
      exchangePolicyRules
    );
    expect(result.isValid).toBe(true);
  });
  test("test check exchange policy with invalidOffer data (1 error)", () => {
    const result = offers.checkExchangePolicy(
      invalidOffer1 as OfferFieldsFragment,
      exchangePolicyRules
    );
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toEqual(1);
    expect(result.errors[0].message).toEqual(
      "Dispute Period Duration is less than 30 days"
    );
  });
  test("test check exchange policy with invalidOffer data (all errors)", () => {
    const result = offers.checkExchangePolicy(
      invalidOffer2 as OfferFieldsFragment,
      exchangePolicyRules
    );
    expect(result.isValid).toBe(false);
    const messagePerPath = {
      disputePeriodDuration: "Dispute Period Duration is less than 30 days",
      disputeResolverId: "Dispute Resolver is not whitelisted",
      "exchangeToken.address": "Currency Token is not whitelisted",
      resolutionPeriodDuration:
        "Resolution Period Duration is less than 15 days",
      "metadata.type":
        "Metadata Type is not a supported standard (PRODUCT_V1, BUNDLE or ITEM_PRODUCT_V1)",
      "metadata.exchangePolicy.template":
        "Buyer/Seller Agreement Template is not standard",
      "metadata.shipping.returnPeriodInDays":
        "Return Period is less than 15 days"
    };
    expect(result.errors.length).toEqual(Object.keys(messagePerPath).length);
    for (const path in messagePerPath) {
      expect(result.errors.find((error) => error.path === path)).toBeTruthy();
      expect(
        result.errors.find((error) => error.path === path)?.message
      ).toEqual(messagePerPath[path]);
    }
  });
  test("test check exchange policy with invalidBundle data (all errors)", () => {
    const result = offers.checkExchangePolicy(
      invalidBundle as OfferFieldsFragment,
      exchangePolicyRules
    );
    expect(result.isValid).toBe(false);
    const messagePerPath = {
      disputePeriodDuration: "Dispute Period Duration is less than 30 days",
      disputeResolverId: "Dispute Resolver is not whitelisted",
      "exchangeToken.address": "Currency Token is not whitelisted",
      resolutionPeriodDuration:
        "Resolution Period Duration is less than 15 days",
      "exchangePolicy.template":
        "Buyer/Seller Agreement Template is not standard",
      "shipping.returnPeriodInDays": "Return Period is less than 15 days"
    };
    expect(result.errors.length).toEqual(Object.keys(messagePerPath).length);
    for (const path in messagePerPath) {
      expect(result.errors.find((error) => error.path === path)).toBeTruthy();
      expect(
        result.errors.find((error) => error.path === path)?.message
      ).toEqual(messagePerPath[path]);
    }
  });
  test("test check exchange policy with invalidOffer data (missing data 1/3)", () => {
    const result = offers.checkExchangePolicy(
      invalidOffer3 as unknown as OfferFieldsFragment,
      exchangePolicyRules
    );
    expect(result.isValid).toBe(false);
    const messagePerPath = {
      "metadata.type": "Metadata Type is not specified",
      "metadata.exchangePolicy.template":
        "Buyer/Seller Agreement Template is not specified",
      "metadata.shipping.returnPeriodInDays": "Return Period is not specified"
    };
    expect(result.errors.length).toEqual(Object.keys(messagePerPath).length);
    for (const path in messagePerPath) {
      expect(result.errors.find((error) => error.path === path)).toBeTruthy();
      expect(
        result.errors.find((error) => error.path === path)?.message
      ).toEqual(messagePerPath[path]);
    }
  });
  test("test check exchange policy with invalidOffer data (missing data 2/3)", () => {
    const result = offers.checkExchangePolicy(
      invalidOffer4 as unknown as OfferFieldsFragment,
      exchangePolicyRules
    );
    expect(result.isValid).toBe(false);
    const messagePerPath = {
      "metadata.type": "Metadata Type is not specified",
      "metadata.exchangePolicy.template":
        "Buyer/Seller Agreement Template is not specified",
      "metadata.shipping.returnPeriodInDays": "Return Period is not specified"
    };
    expect(result.errors.length).toEqual(Object.keys(messagePerPath).length);
    for (const path in messagePerPath) {
      expect(result.errors.find((error) => error.path === path)).toBeTruthy();
      expect(
        result.errors.find((error) => error.path === path)?.message
      ).toEqual(messagePerPath[path]);
    }
  });
  test("test check exchange policy with invalidOffer data (missing data 3/3)", () => {
    const result = offers.checkExchangePolicy(
      invalidOffer5 as unknown as OfferFieldsFragment,
      exchangePolicyRules
    );
    expect(result.isValid).toBe(false);
    const messagePerPath = {
      "metadata.exchangePolicy.template":
        "Buyer/Seller Agreement Template is not specified",
      "metadata.shipping.returnPeriodInDays": "Return Period is not specified"
    };
    expect(result.errors.length).toEqual(Object.keys(messagePerPath).length);
    for (const path in messagePerPath) {
      expect(result.errors.find((error) => error.path === path)).toBeTruthy();
      expect(
        result.errors.find((error) => error.path === path)?.message
      ).toEqual(messagePerPath[path]);
    }
  });
});
