import {
  TransactionResponse,
  TransactionRequest,
  Web3LibAdapter
} from "@bosonprotocol/common";
import { Range } from "@bosonprotocol/common/src/types";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { handler } from ".";
import { accounts, erc721 } from "..";
import { getOfferById } from "../offers/subgraph";
import { encodeValidate, Order as SeaportOrder } from "../seaport/interface";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";

export class VoucherMixin<T extends Web3LibAdapter> extends BaseCoreSDK<T> {
  /**
   * Burns preminted vouchers from an offer by calling the voucher contract.
   * This transaction only succeeds if there is an existing seller account for connected signer.
   * @param offerId - Offer ID
   * @param amount - Amount to burn
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async burnPremintedVouchers(
    offerId: BigNumberish,
    amount: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async burnPremintedVouchers(
    offerId: BigNumberish,
    amount: BigNumberish,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async burnPremintedVouchers(
    offerId: BigNumberish,
    amount: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;
    const offerFromSubgraph = await getOfferById(this._subgraphUrl, offerId);

    const burnArgs = {
      offerId,
      amount,
      contractAddress:
        overrides.contractAddress ||
        offerFromSubgraph.seller.voucherCloneAddress,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof handler.burnPremintedVouchers>[0];

    if (returnTxInfo === true) {
      return handler.burnPremintedVouchers({
        ...burnArgs,
        returnTxInfo: true
      });
    } else {
      return handler.burnPremintedVouchers({
        ...burnArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Pre-mints all or part of an offer's reserved vouchers by calling the voucher contract.
   * This transaction only succeeds if there is an existing seller account for connected signer.
   * @param offerId - Offer ID
   * @param amount - Amount to pre-mint
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async preMint(
    offerId: BigNumberish,
    amount: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async preMint(
    offerId: BigNumberish,
    amount: BigNumberish,
    overrides?: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async preMint(
    offerId: BigNumberish,
    amount: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;
    const offerFromSubgraph = await getOfferById(this._subgraphUrl, offerId);

    const preMintArgs = {
      offerId,
      amount,
      contractAddress:
        overrides.contractAddress ||
        offerFromSubgraph.seller.voucherCloneAddress,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof handler.preMint>[0];

    if (returnTxInfo === true) {
      return handler.preMint({
        ...preMintArgs,
        returnTxInfo: true
      });
    } else {
      return handler.preMint({
        ...preMintArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Transfers voucher from one address to another by calling the voucher contract.
   * This transaction only succeeds if there is an existing seller account for connected signer.
   * @param offerId - Offer ID
   * @param to - Recipient address
   * @param tokenId - Token ID to transfer
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async transferFrom(
    offerId: BigNumberish,
    to: BigNumberish,
    tokenId: BigNumberish,
    overrides: Partial<{
      owner: BigNumberish;
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async transferFrom(
    offerId: BigNumberish,
    to: BigNumberish,
    tokenId: BigNumberish,
    overrides?: Partial<{
      owner: BigNumberish;
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async transferFrom(
    offerId: BigNumberish,
    to: BigNumberish,
    tokenId: BigNumberish,
    overrides: Partial<{
      owner: BigNumberish;
      contractAddress: string;
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;
    const offerFromSubgraph = await getOfferById(this._subgraphUrl, offerId);

    const transferArgs = {
      from: overrides.owner || (await this._web3Lib.getSignerAddress()),
      to,
      tokenId,
      contractAddress:
        overrides.contractAddress ||
        offerFromSubgraph.seller.voucherCloneAddress,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof handler.transferFrom>[0];

    if (returnTxInfo === true) {
      return handler.transferFrom({
        ...transferArgs,
        returnTxInfo: true
      });
    } else {
      return handler.transferFrom({
        ...transferArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Sets contract URI by calling the voucher contract.
   * This transaction only succeeds if there is an existing seller account for connected signer.
   * @param contractURI - Contract URI
   * @param collectionIndex - Collection index
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  // Overload: returnTxInfo is true → returns TransactionRequest
  public async setContractURI(
    contractURI: string,
    collectionIndex: BigNumberish,
    overrides: Partial<{
      txRequest: TransactionRequest;
      returnTxInfo: true;
    }>
  ): Promise<TransactionRequest>;

  // Overload: returnTxInfo is false or undefined → returns TransactionResponse
  public async setContractURI(
    contractURI: string,
    collectionIndex: BigNumberish,
    overrides?: Partial<{
      txRequest: TransactionRequest;
      returnTxInfo?: false | undefined;
    }>
  ): Promise<TransactionResponse>;

  // Implementation
  public async setContractURI(
    contractURI: string,
    collectionIndex: BigNumberish,
    overrides: Partial<{
      txRequest: TransactionRequest;
      returnTxInfo?: boolean;
    }> = {}
  ): Promise<TransactionResponse | TransactionRequest> {
    const { returnTxInfo } = overrides;
    const sellerAddress = await this._web3Lib.getSignerAddress();
    const seller = await accounts.subgraph.getSellerByAddress(
      this._subgraphUrl,
      sellerAddress
    );
    if (!seller) {
      throw new Error(`No seller found for wallet ${sellerAddress}`);
    }
    const collection = seller.collections.find((coll) =>
      BigNumber.from(coll.collectionIndex).eq(collectionIndex)
    );
    if (!collection) {
      throw new Error(
        `Collection with index ${collectionIndex} not found for seller with id ${seller.id}`
      );
    }

    const setContractURIArgs = {
      contractURI,
      contractAddress: collection.collectionContract.address,
      web3Lib: this._web3Lib
    } as const satisfies Parameters<typeof handler.setContractURI>[0];

    if (returnTxInfo === true) {
      return handler.setContractURI({
        ...setContractURIArgs,
        returnTxInfo: true
      });
    } else {
      return handler.setContractURI({
        ...setContractURIArgs,
        returnTxInfo: false
      });
    }
  }

  /**
   * Gets the number of vouchers available to be pre-minted for an offer.
   * @param offerId - Offer ID
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async getAvailablePreMints(
    offerId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<string> {
    const offerFromSubgraph = await getOfferById(this._subgraphUrl, offerId);
    return handler.getAvailablePreMints({
      offerId,
      contractAddress:
        overrides.contractAddress ||
        offerFromSubgraph.seller.voucherCloneAddress,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Gets the range for an offer.
   * @param offerId - Offer ID
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async getRangeByOfferId(
    offerId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<Range> {
    const offerFromSubgraph = await getOfferById(this._subgraphUrl, offerId);
    return handler.getRangeByOfferId({
      offerId,
      contractAddress:
        overrides.contractAddress ||
        offerFromSubgraph.seller.voucherCloneAddress,
      web3Lib: this._web3Lib
    });
  }

  public async isApprovedForAll(
    operator: string,
    overrides: Partial<{
      owner: string;
      contractAddress: string;
    }> = {}
  ) {
    const sellerAddress = await this._web3Lib.getSignerAddress();
    const seller = await accounts.subgraph.getSellerByAddress(
      this._subgraphUrl,
      sellerAddress
    );
    return handler.isApprovedForAll({
      owner: overrides.owner || sellerAddress,
      operator,
      contractAddress: overrides.contractAddress || seller.voucherCloneAddress,
      web3Lib: this._web3Lib
    });
  }

  public async setApprovalForAllToContract(
    operator: string,
    approved: boolean,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ) {
    const sellerAddress = await this._web3Lib.getSignerAddress();
    const seller = await accounts.subgraph.getSellerByAddress(
      this._subgraphUrl,
      sellerAddress
    );
    return handler.setApprovalForAllToContract({
      operator,
      approved,
      contractAddress: overrides.contractAddress || seller.voucherCloneAddress,
      web3Lib: this._web3Lib
    });
  }

  public async approveProtocolForAll(
    overrides: Partial<{
      operator: string;
      contractAddress: string;
    }> = {}
  ) {
    const sellerAddress = await this._web3Lib.getSignerAddress();
    const seller = await accounts.subgraph.getSellerByAddress(
      this._subgraphUrl,
      sellerAddress
    );
    return erc721.handler.setApprovalForAll({
      operator: overrides.operator || this._protocolDiamond,
      approved: true,
      contractAddress: overrides.contractAddress || seller.voucherCloneAddress,
      web3Lib: this._web3Lib
    });
  }

  public async validateSeaportOrders(
    openseaConduit: string,
    seaportContract: string,
    orders: SeaportOrder[],
    overrides: Partial<{
      contractAddress: string;
      approveIfNeeded: boolean;
    }> = { approveIfNeeded: true }
  ) {
    const sellerAddress = await this._web3Lib.getSignerAddress();
    const seller = await accounts.subgraph.getSellerByAddress(
      this._subgraphUrl,
      sellerAddress
    );
    if (overrides.approveIfNeeded) {
      // Check the openseaConduit is approved for preminted tokens
      const isApprovedForAll = await this.isApprovedForAll(openseaConduit, {
        owner: seller.voucherCloneAddress,
        contractAddress: overrides.contractAddress || seller.voucherCloneAddress
      });
      if (!isApprovedForAll) {
        const txApproval = await this.setApprovalForAllToContract(
          openseaConduit,
          true,
          overrides
        );
        await txApproval.wait();
      }
    }
    return handler.callExternalContract({
      to: seaportContract,
      data: encodeValidate(orders),
      contractAddress: overrides.contractAddress || seller.voucherCloneAddress,
      web3Lib: this._web3Lib
    });
  }
}
