# Buyer and Seller Agreement

The following agreement (the “**Agreement**") is entered into by and between you (the “**Buyer**”) and the Seller, and sets out the terms relating to a transaction whereby:

- A) The Seller offers its products or services for sale through a Redeemable NFT (the “**rNFT**”), which can be redeemed for the Item.

- B) The Buyer redeems the rNFT from the Seller to obtain the Item.

- C) The Buyer agrees to obtain and the Seller agrees to provide the Item on the terms set out in this Agreement.

The Seller and the Buyer hereinafter collectively referred to as the “**Parties**” and each individually as a “**Party**”.

## BACKGROUND

### (A) About Boson Protocol

As Web3’s Commerce Layer, Boson Protocol enables the tokenization, transfer and trade of any physical thing as a Redeemable NFT.

### (B) How Boson Protocol works

#### Offer Creation

The Seller creates an Offer to sell an Item at a particular price, sets the Cancellation Penalty and the Seller Deposit, the Offer Validity Period, the Redemption Period, and the Resolution Period.

The Seller puts the Seller Deposit into the seller pool that is locked in a smart contract.

The Seller unilaterally appoints a Dispute Resolver (the “**DR**”). Once the DR is appointed, it cannot be changed by the Seller after the Offer Creation stage.

#### Committing to an Offer

The Buyer reviews the Offer details and commits to the Offer by depositing the Item Price that is locked in the smart contract.

The Buyer receives the rNFT in their wallet address.

#### Revoking an rNFT

The Seller can revoke an rNFT after the Buyer has committed to an Offer, as a result forfeiting their Seller Deposit and allowing the Buyer to withdraw their payment and the Seller Deposit. The Buyer can withdraw the funds left immediately after the Seller has revoked an r‍NFT.

#### Cancelling an rNFT

The Buyer can cancel an rNFT after committing to an Offer, as a result forfeiting their Cancellation Penalty, but getting a refund of the funds left, which is the Item Price less the Cancellation Penalty. The Buyer can withdraw the funds left immediately after the cancellation. If there is a secondary sale / transfer and the holder of the rNFT cancels the rNFT, the holder of the rNFT can only withdraw the funds that are locked in the smart contract.

#### Redeem a Voucher

‍The Buyer can redeem an rNFT within the Redemption Period, which specifies a start point in time at which the rNFT becomes redeemable, and a point in time at which the rNFT expires and can no longer be exchanged for the relevant Items. If the Buyer does not redeem the rNFT before the Redemption Period is over, they are deemed to have cancelled the rNFT.

### AGREED TERMS

1. Redemption

   1.1 To redeem the rNFT, the Buyer shall:

   - 1.1.1 read, understand and accept the additional terms of sale within the Seller’s Shop Policy (Exhibit A) and the Privacy Policy (Exhibit B).

   - 1.1.2. provide the contact information and the delivery details to the Seller using the Seller Contact Method.

2. Fulfillment

   2.1. When the Buyer redeems the rNFT, the Seller will have the Item delivered to the Buyer within the Delivery Period.

3. Dispute Resolution

   3.1. If the Offer is not fulfilled in accordance with the Agreement and the Seller’s Shop Policy (Exhibit A), the Buyer can raise a complaint (the “**Dispute**”), which triggers the transaction to be set to the **Dispute State**. The Buyer must raise the complaint before the Dispute Period ends.

   3.2. The Buyer and the Seller shall attempt to resolve the Dispute mutually by communicating via the Seller Contact Method. They may agree to a split of the Deposit Pool. If an agreement is reached, one party (Buyer or Seller) signs a message which indicates the agreed-upon split. The other party uploads the decision on-chain and moves the Dispute to the **Resolved State** allowing the Buyer and the Seller to withdraw their payoff accordingly.

   3.3. The dispute must be mutually resolved within the Resolution Period. The Seller can extend the Resolution Period. If the dispute has not moved to the Resolved State and no time extension is given before the Resolution Period is over, then the dispute is moved to the **Retracted State** and the transaction is completed.

   3.4. Buyer can unilaterally move the dispute to the Retracted State, or submit the dispute on-chain for a decision to the nominated DR together with the Escalation Deposit, which then moves the Dispute to the “**Escalated State**”.

   3.5. When a Dispute is moved to the Escalated State, an Escalation Response Period starts, which is defined by the DR. The DR can refuse to decide on a Dispute. The dispute is considered refused by the DR if the DR submits the refusal to decide on-chain, or if no decision was submitted before the end of that period. In both cases, the parties can withdraw the funds deposited in the smart contract in case of the DR refusal.

   3.6. Following escalation, the DR communicates with the Buyer and the Seller off-chain to seek facts about the dispute and reviews them against the terms of the transaction (per the decision tree and specifications below). Following the submission of evidence, if any, by the Parties, the DR provides a decision about the split of the Deposit Pool by triggering an on-chain transaction (the “**Decided State**”). The Buyer and the Seller can then withdraw their payoff according to DR’s decision.

   _DR Decision Tree [IMAGE - TBD]_

   3.7. The Buyer and the Seller shall provide the following evidence to the DR to resolve the dispute:

   - 3.7.1. **Non-Delivery**: This includes any case relating to non-delivery, including failure by the Seller to send the Item, porch piracy, and courier failures.

     - (a) Evidence Required from the Seller:
       - (i) Dispatch Evidence - a scanned copy of delivery forms or departure information, with the name, full address, and postcode (if any) of the recipient; or a delivery service receipt or customs form that includes the date of dispatch, as well as the name, full address, or postcode of the recipient.
       - (ii) Delivery Evidence - carrier tracking number with delivered status; proof of delivery - signed & received by recipient; proof of delivery - an image of the package at destination; or a valid tracking number showing movement to the address listed at the time of the transaction or agreed upon between the Buyer and the Seller.
     - (b) Evidence Required from the Buyer: order confirmation email / message where the Buyer specified the name, address, and postal code (if any) of delivery.

   - 3.7.2. **Missed Estimated Time of Arrival**

     - (a) Evidence required from the Seller:
       - (i) Delivery Period promise, order confirmation email / message with latest permissible date of delivery mentioned; or store FEP at time of commit stating shipment times & windows, and/or permissible delay due to custom clearance and the buyer’s obligation to pay custom and duties.
       - (ii) Tracking number - showing date of delivery at the destination country
     - (b) Evidence Required from the Buyer: order confirmation email / message with the latest permissible date of delivery mentioned.

   - 3.7.3. **Not meeting Buyer expectations**: This includes any case relating to item not-as-described, incomplete / incorrect / damaged order, performance / quality not adequate, wrong item sent, missing parts / accessories, item defective / does not work, description was not accurate, or arrived in addition to what was ordered.

     - (a) Evidence required from the Seller: description of the Item at the time of purchase
     - (b) Evidence required from the Buyer:
       - (i) Image / video from Buyer showing the item, the condition of the Item, or package received; or
       - (ii) Description of the Item at the time of purchase; or
       - (iii) Description of incorrect quantities

   - 3.7.4. **Returns & Cancellations**: This relates to the case where the Buyer wants to return the item or cancel the order and the Seller does not fulfil their terms of return & cancellation in the Seller’s Shop Policy (Exhibit A).
     - (a) Evidence Required from the Seller: return & cancellation rules per the Seller’s Shop Policy (Exhibit A)
     - (b) Evidence Required from the Buyer: return requirement, evidence of requests / denials via email or communication when Seller doesn’t fulfil their terms of return & cancellation

   The preceding section does not preclude the DR from considering other issues in dispute and resorting to other evidence that the Parties may provide to resolve the dispute promptly and fairly at the DR’s discretion.

4. **Privacy and Personal Data Protection**

   Please refer to Exhibit B - the Seller’s Privacy Policy.

5. **Open Source Software**

   The Parties acknowledge that the transaction takes place on Boson Protocol, an open source protocol on the Polygon blockchain, and agree to be bound by, and comply with, any license agreements and/or terms of service that may apply to Boson Protocol and/or the Polygon blockchain. The Parties confirm that they have read and understand and agree to the terms, the mechanism and risks associated with these open source software protocols.

6. **Governing Law and Jurisdiction**

   Any claims, disputes and controversies arising out of these Terms or in connection with the transaction shall be settled in accordance with the dispute process established herein (see section 3).

7. **Waiver and Severability**

   The waiver or failure of any party to exercise rights under these Terms will not be deemed a waiver or other limitation of any other right or any future right. Any waiver must be in writing and signed by the party to be charged therewith.

   If any provision of these Terms is held by a court or other tribunal of competent jurisdiction to be invalid, illegal or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of the Terms will continue in full force and effect.

8. **Definitions**

   Any word following the terms including or include, or any similar expression, shall be construed as illustrative and shall not limit the sense of the words, description, definition, phrase or term preceding those terms.

   **Buyer** means a person who purchases the rNFT for the right to redeem the Item and/or a person who holds the rNFT for the right to redeem the Item.

   **Cancellation Penalty** means the funds the Buyer forfeits when they cancel a rNFT. The Cancellation Penalty is set as **_{{buyerCancelPenaltyValue}} {{exchangeTokenSymbol}}_**.

   **Commit** means a Buyer signs a transaction as their commitment to the Offer.

   **Deposit Pool** means the sum of the Item Price, the Seller Deposit, and the Escalation Deposit (if applicable).

   **Delivery Period** means the time period during which the Seller must have the Item delivered to the Buyer.

   **Dispute Period** means the time period within which the Buyer can raise a dispute and after which the Seller is automatically paid. It ends within **_{{#msecToDay}}{{disputePeriodDurationInMS}}{{/msecToDay}}_** days after the Buyer redeems the rNFT.

   **Dispute Resolver** means an authority that decides on a dispute between the Parties. The Dispute Resolver hears each side and then decides the outcome of the dispute in accordance with this Buyer and Seller Agreement.

   **Dispute Resolution Contact Method** means **_{{disputeResolverContactMethod}}_**.

   **Escalation Deposit** means the funds a Buyer puts down to escalate the Dispute, which becomes part of the Deposit Pool. The Escalation Deposit is set as **_{{escalationDepositValue}} {{exchangeTokenSymbol}}_**.

   **Escalation Response Period** means the period during which the Dispute Resolver can respond to a Dispute, which is within **_{{#secToDay}}{{escalationResponsePeriodInSec}}{{/secToDay}}_** days after the Buyer escalates the Dispute.

   **Item** means the thing being sold or a set of things being sold together in a single Offer.

   **Item Price** means the funds a Buyer commits for the right to redeem an Item at the Commit action. The Item Price is set as **_{{priceValue}} {{exchangeTokenSymbol}}_**. The Item Price includes delivery costs. For customs and import taxes, refer to Exhibit A - Seller’s Shop Policy, clause 1.1.

   **Offer** means an expression of readiness by the Seller to sell an Item.

   **Offer Validity Period** means the period during which a Buyer may Commit to the Seller’s Offer, which is from **_{{#toISOString}}{{validFromDateInMS}}{{/toISOString}}_** to **_{{#toISOString}}{{validUntilDateInMS}}{{/toISOString}}_**.

   **Seller** means a person who offers to sell an Item through a rNFT. The Seller is **_{{sellerTradingName}}_**.

   **Seller Contact Method** means **_{{sellerContactMethod}}_**.

   **Seller Deposit** means the funds deposited by the Seller and locked in the Boson smart contracts. If the Seller revokes an rNFT, they will lose the Seller Deposit. If a dispute happens, those funds can be used to penalize the Seller based on the Dispute Resolver decision. The Seller Deposit is set as **_{{sellerDepositValue}} {{exchangeTokenSymbol}}_**.

   **Return Delivery Address** means the address that the Buyer will ship the Item to for a refund, which will be provided by the Seller after accepting the return request.

   **Redeemable NFT (rNFT / NFT Voucher)** means a voucher using NFT technology, representing the right to redeem an Item.

   **Redemption Period** means the time period when an rNFT can be redeemed by the Buyer, which is from **_{{#toISOString}}{{voucherRedeemableFromDateInMS}}{{/toISOString}}_** to **_{{#toISOString}}{{voucherRedeemableUntilDateInMS}}{{/toISOString}}_**.

   **Resolution Period** means the time period during which the Buyer and the Seller may mutually resolve a Dispute, which is within **_{{#msecToDay}}{{resolutionPeriodDurationInMS}}{{/msecToDay}}_** days after the dispute is raised.

   **Return Period** means the period the Buyer must contact the Seller for a return, which is within **_{{returnPeriodInDays}}_** days of delivery of the Item.

### Exhibit A - Seller’s Shop Policy

1. Customs and Import Taxes

   1.1. Unless specified by the Seller, Buyers are responsible for any customs and import taxes that may apply.

2. Delivery

   2.1. If the Seller is unable to deliver the Item, the Seller will inform the Buyer. This might be because the Item is out of stock, because the Seller has identified an error in the price or description of the Item, because the Seller is unable to ship delivery to the Buyer’s jurisdiction or to the Buyer, or because the Buyer has been required to take and has failed the Seller’s KYC (‘Know Your Customer’) check (if applicable).

3. Returns & Exchanges

   3.1. Returns are accepted by the Seller subject to 3.2.

   3.2. To effect an exchange / return, the Buyer must comply with the following:

   - 3.2.1. The Buyer must contact the Seller for a return / exchange within the Return Period via the Seller Contact Method.
   - 3.2.2. The Item must be unused and in the same condition that the Buyer received it. It must also be in the original packaging. If the Item is not returned in its original condition, the Buyer is responsible for any loss in value.
   - 3.2.3. To complete a return, the proof of purchase must be shown to the Seller.

     Returns do not apply to custom-made products, digital items, certain perishable goods, or goods that can’t be reused for health or hygiene reasons and are unsealed after delivery.

   3.3. To return your Item, you should mail your product to the Return Delivery Address.

   3.4. The Buyer will be paying for the costs of returning the Item.

### Exhibit B - Seller’s Privacy Policy

1. About this Policy

   1.1. This Privacy Policy describes how and when the Seller collects, uses, and shares information when the Buyer purchases an item from the Seller’s shop, contacts the Seller, or otherwise uses the Seller’s services or its related sites and services.

   1.2. The Buyer agrees that by purchasing an Item from the Seller, the Buyer has read, understood, and agreed to be bound by all of the terms of this Privacy Policy. If the Buyer does not agree, the Buyer must not interact with the seller.

   1.3. The Seller may change this Privacy Policy from time to time. If the Seller makes a change that significantly affects the Buyer’s rights or, to the extent the Seller is permitted to do so, significantly changes how or why the Seller uses personal data, the Seller will notify the Buyer by way of a prominent notice on our website or, if the Seller has the Buyer’s email address, by email.

2. Information the Seller Collects

   2.1. To fulfill the Buyer’s order, the Buyer may provide the Seller with certain information, such as, but not limited to, your name, e-mail address, postal address, telephone number, and public cryptographic key relating to addresses on distributed ledger networks and/or similar information (i.e. public wallet address).

3. Why the Seller Needs the Buyer’s Information and How the Seller Uses It

   3.1. The Seller collects, uses and shares the Buyer’s information in several legally-permissible ways, including:

   - 3.1.1. As needed to provide the Seller’s services, such as when the Seller uses the Buyer’s information to fulfill the Buyer’s order, to settle disputes, or to provide the Buyer with customer support;
   - 3.1.2. If necessary to comply with a court order or legal obligation, such as retaining information about the Buyer’s purchases if required by tax law; and
   - 3.1.3. As necessary for the Seller’s own legitimate interests, if those legitimate interests are not overridden by the Buyer’s rights or interests, such as (a) providing and enhancing the Seller’s services; (b) Compliance with the Seller’s Policy.

4. Information Sharing and Disclosure

   4.1. The Seller may from time to time, disclose the Buyer’s personal data to third parties in connection with purposes described in paragraph 3 above, including without limitation the following circumstances:

   - 4.1.1. disclosing to third parties who provide services to the Seller (including but not limited to, data providers and technology providers (including services relating to telecommunications, information technology, payment, data processing, storage and archival), and professional services (including our accountants, auditors and lawyers).
   - 4.1.2. disclosing with third party identity verification and transaction monitoring services to assist in the prevention of fraud and other illegal activities and to fulfill our obligations under anti-money laundering and countering the financing of terrorism laws and regulations.
   - 4.1.3. disclosing to third parties who provide web monitoring services
   - 4.1.4. disclosing to third parties in order to fulfil such third party products and/or services as may be requested or directed by the Buyer;
   - 4.1.5. disclosing to third parties that the Seller conducts marketing and cross promotions with;
   - 4.1.6. disclosing to regulators, governments, law enforcement agencies, public agencies and/or authorities;
   - 4.1.7. if the Seller is discussing selling or transferring part or all of the Seller’s business – the information may be transferred to prospective purchasers under suitable terms as to confidentiality.

5. How Long the Seller Stores the Buyer’s Information

   5.1. The Seller retains the Buyer’s personal information only for as long as necessary to provide the Buyer with the Seller’s services and as otherwise described in the Seller’s Privacy Policy. However, the Seller may also be required to retain this information to comply with legal and regulatory obligations, to resolve disputes, and to enforce or perform under the Seller’s agreements. The Seller generally keeps the Buyer’s data for five (5) years.

6. Transfers of Personal Information Outside the EU

   6.1. The Seller may store and process the Buyer’s information through third-party hosting services in the US and other jurisdictions. As a result, the Seller may transfer the Buyer’s personal information to a jurisdiction with different data protection and government surveillance laws than the Buyer’s jurisdiction has. If the Seller is required to transfer information about the Buyer outside of the EU, the Seller relies on Privacy Shield as the legal basis for the transfer, as Google Cloud is Privacy Shield certified.

7. The Buyer’s Rights

   7.1. If the Buyer resides in certain territories, including the EU, the Buyer has a number of rights in relation to the Buyer’s personal information. While some of these rights apply generally, certain rights apply only in certain limited cases. The Buyer’s rights are as follows:

   - 7.1.1. Right to Access. The Buyer may have the right to access and receive a copy of the personal information the Seller holds about the Buyer by contacting the Seller using the Seller Contact Method.
   - 7.1.2. Right to Change, Restrict, or Delete. The Buyer may also have rights to change, restrict the Seller’s use of, or delete the Buyer’s personal information. Absent exceptional circumstances (such as where the Seller is required to store information for legal reasons) the Seller will generally delete the Buyer’s personal information upon request.
   - 7.1.3. Right to Object. The Buyer can object to (a) the Seller’s processing of some of the Buyer’s information based on the Seller’s legitimate interests and (b) receiving marketing messages from the Seller. In such cases, the Seller will delete the Buyer’s personal information unless the Seller has compelling and legitimate grounds to continue storing and using the Buyer’s information or if it is needed for legal reasons.
   - 7.1.4. Right to Complain. If the Buyer resides in the EU and wish to raise a concern about the Seller’s use of the Buyer’s information (and without prejudice to any other rights the Buyer may have), the Buyer has the right to do so with the Buyer’s local data protection authority.

8. How to Contact the Seller

   8.1. The Buyer may reach the Seller with any concerns relating to privacy via the Seller Contact Method. For purposes of EU data protection law, the Seller is the data controller of the Buyer’s personal information.

---
