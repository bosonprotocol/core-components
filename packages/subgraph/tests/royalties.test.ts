import { test, assert, log } from "matchstick-as/assembly/index";
import { handleRoyaltyRecipientsChangedEvent } from "../src/mappings/account-handler";
import { createRoyaltyRecipientsChanged, mockSeller } from "./mocks";
import { Seller } from "../generated/schema";

const sellerId = 1;
const recipients_1 = [
  "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
];
const minRoyaltyPercentages_1 = [100, 200];
const recipients_2 = [
  "0xcccccccccccccccccccccccccccccccccccccccc",
  "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", // reuse from recipients_1
  "0xdddddddddddddddddddddddddddddddddddddddd"
];
const minRoyaltyPercentages_2 = [300, 400, 500];
const executedBy = "0x0abcdef1234567890abcdef12345678901234567";

test("handle RoyaltyRecipientsChangedEvent", () => {
  mockSeller(sellerId.toString());
  const royaltyRecipientsChanged_1 = createRoyaltyRecipientsChanged(
    sellerId,
    recipients_1,
    minRoyaltyPercentages_1,
    executedBy
  );
  handleRoyaltyRecipientsChangedEvent(royaltyRecipientsChanged_1);
  checkSellerRoyaltyRecipients(sellerId, recipients_1, minRoyaltyPercentages_1);

  const royaltyRecipientsChanged_2 = createRoyaltyRecipientsChanged(
    sellerId,
    recipients_2,
    minRoyaltyPercentages_2,
    executedBy
  );
  handleRoyaltyRecipientsChangedEvent(royaltyRecipientsChanged_2);
  checkSellerRoyaltyRecipients(sellerId, recipients_2, minRoyaltyPercentages_2);
});

function checkSellerRoyaltyRecipients(
  sellerId: i32,
  recipients: string[],
  minRoyaltyPercentages: i32[]
): void {
  const seller = Seller.load(sellerId.toString());
  log.debug("check seller {} exists", [sellerId.toString()]);
  assert.assertNotNull(seller);
  const sellerRoyaltyRecipients = (seller as Seller).royaltyRecipients.load();
  log.debug("check sellerRoyaltyRecipients {} exists", [
    (sellerRoyaltyRecipients != null).toString()
  ]);
  assert.assertNotNull(sellerRoyaltyRecipients);
  log.debug("check sellerRoyaltyRecipients.length {} == {}", [
    sellerRoyaltyRecipients.length.toString(),
    recipients.length.toString()
  ]);
  assert.assertTrue(recipients.length === sellerRoyaltyRecipients.length);
  for (let i = 0; i < sellerRoyaltyRecipients.length; i++) {
    const sellerRoyaltyRecipient = sellerRoyaltyRecipients[i];
    log.debug("check sellerRoyaltyRecipient {} exists", [
      sellerRoyaltyRecipient.id
    ]);
    assert.assertNotNull(sellerRoyaltyRecipient);
    let found = false;
    for (let j = 0; j < recipients.length && !found; j++) {
      found =
        sellerRoyaltyRecipient.wallet.toHexString().toLowerCase() ==
        recipients[j].toLowerCase();
    }
    log.debug("check wallet {} is found", [
      sellerRoyaltyRecipient.wallet.toHexString()
    ]);
    assert.assertTrue(found);
    found = false;
    for (let j = 0; j < minRoyaltyPercentages.length && !found; j++) {
      found =
        sellerRoyaltyRecipient.minRoyaltyPercentage.toString() ==
        minRoyaltyPercentages[j].toString();
    }
    log.debug("check minRoyaltyPercentage {} is found", [
      sellerRoyaltyRecipient.minRoyaltyPercentage.toHexString()
    ]);
    assert.assertTrue(found);
  }
}
