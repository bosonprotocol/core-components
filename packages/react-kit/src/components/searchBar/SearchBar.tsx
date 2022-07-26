import React, { useState } from "react";
import { MagnifyingGlass } from "../../icons/MagnifyingGlass";
import { useCoreSdk } from "../../hooks/useCoreSdk";
import { InputField, InputWrapper } from "./SearchBar.styles";
import { subgraph } from "@bosonprotocol/core-sdk";

interface SearchBarProps {
  /**
   * Target chain.
   */
  chainId: number;
  placeholder?: string;
  disabled?: boolean;
  /**
   * Optional callback to invoke with search results.
   */
  onSuccess?: (results: {
    products: subgraph.BaseMetadataEntityFieldsFragment[];
    users: any[];
  }) => void;
  /**
   * Optional callback to invoke if an error happened.
   */
  onError?: (error: Error) => void;
}

export const SearchBar = ({
  placeholder = "Search...",
  disabled = false,
  chainId,
  onSuccess,
  onError
}: SearchBarProps) => {
  const [value, setValue] = useState("");

  const coreSdk = useCoreSdk({ chainId });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    try {
      if (e.key === "Enter") {
        e.preventDefault();

        let searchResults: subgraph.BaseMetadataEntityFieldsFragment[] = [];

        const searchResultsDescPromise = coreSdk.getBaseMetadataEntities({
          metadataFilter: {
            description_contains_nocase: value
          }
        });

        const searchResultsNamePromise = coreSdk.getBaseMetadataEntities({
          metadataFilter: {
            name_contains_nocase: value
          }
        });

        const searchResultsIdPromise = coreSdk.getBaseMetadataEntities({
          metadataFilter: {
            offer: value
          }
        });

        // get seller by ID
        const sellerByIdPromise = coreSdk.getSellers({
          sellersFilter: {
            id: value
          }
        });

        // get seller by Address
        const sellerByAddressPromise = coreSdk.getSellerByAddress(value);

        // get buyers by Address
        const buyerByAddressPromise = coreSdk.getBuyers({
          BuyersFilter: {
            wallet: value
          }
        });

        // get buyers by Address
        const buyerByIdPromise = coreSdk.getBuyers({
          BuyersFilter: {
            id: value
          }
        });

        const [
          searchResultsDesc,
          searchResultsName,
          searchResultsId,
          sellerById,
          sellerByAddress,
          buyerById,
          buyerByAddress
        ] = await Promise.all([
          searchResultsDescPromise,
          searchResultsNamePromise,
          searchResultsIdPromise,
          sellerByIdPromise,
          sellerByAddressPromise,
          buyerByIdPromise,
          buyerByAddressPromise
        ]);

        const sellerByAddressList = sellerByAddress ? [sellerByAddress] : [];

        searchResults = [
          // remove duplicates from search results
          ...new Map(
            [
              ...searchResultsDesc,
              ...searchResultsName,
              ...searchResultsId
            ].map((searchResult) => [searchResult.id, searchResult])
          ).values()
        ];

        /**
         *  TODO: define in case of several users with the same address 
         *  if we wanna return both (seller and buyer) or only one
         */
        const users = [
          ...sellerById,
          ...sellerByAddressList,
          ...buyerById,
          ...buyerByAddress
        ];

        onSuccess?.({ products: searchResults, users: users });
      }
    } catch (error) {
      onError?.(error as Error);
    }
  };

  return (
    <InputWrapper disabled={disabled}>
      <MagnifyingGlass />
      <InputField
        value={value}
        name="search"
        type="text"
        placeholder={placeholder}
        onKeyDown={handleEnter}
        onChange={handleChange}
        disabled={disabled}
      />
    </InputWrapper>
  );
};
