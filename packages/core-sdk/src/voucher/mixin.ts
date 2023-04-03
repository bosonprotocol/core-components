import { TransactionResponse } from "@bosonprotocol/common";
import { Range } from "@bosonprotocol/common/src/types";
import { BigNumberish } from "@ethersproject/bignumber";
import { handler } from ".";
import { accounts } from "..";
import { getOfferById } from "../offers/subgraph";
import { encodeValidate, Order as SeaportOrder } from "../seaport/handler";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";

export class VoucherMixin extends BaseCoreSDK {
  /**
   * Burns preminted vouchers from an offer
   * @param offerId -  Offer ID
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async burnPremintedVouchers(
    offerId: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    const offerFromSubgraph = await getOfferById(this._subgraphUrl, offerId);
    return handler.burnPremintedVouchers({
      offerId,
      contractAddress:
        overrides.contractAddress ||
        offerFromSubgraph.seller.voucherCloneAddress,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Gets the number of vouchers available to be pre-minted for an offer.
   * @param offerId -  Offer ID
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
   * @param offerId -  Offer ID
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

  /**
   * Pre-mints all or part of an offer's reserved vouchers.
   * @param offerId -  Offer ID
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async preMint(
    offerId: BigNumberish,
    amount: BigNumberish,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    const offerFromSubgraph = await getOfferById(this._subgraphUrl, offerId);
    return handler.preMint({
      offerId,
      amount,
      contractAddress:
        overrides.contractAddress ||
        offerFromSubgraph.seller.voucherCloneAddress,
      web3Lib: this._web3Lib
    });
  }

  /**
   * Pre-mints all or part of an offer's reserved vouchers.
   * @param offerId -  Offer ID
   * @param overrides - Optional overrides.
   * @returns Transaction response.
   */
  public async transferFrom(
    offerId: BigNumberish,
    to: BigNumberish,
    tokenId: BigNumberish,
    overrides: Partial<{
      owner: BigNumberish;
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    const offerFromSubgraph = await getOfferById(this._subgraphUrl, offerId);

    return handler.transferFrom({
      from: overrides.owner || (await this._web3Lib.getSignerAddress()),
      to,
      tokenId,
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

  public async setContractURI(
    contractURI: string,
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<TransactionResponse> {
    const sellerAddress = await this._web3Lib.getSignerAddress();
    const seller = await accounts.subgraph.getSellerByAddress(
      this._subgraphUrl,
      sellerAddress
    );
    return handler.setContractURI({
      contractURI,
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
