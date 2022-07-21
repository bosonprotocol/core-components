import React, { useState } from "react";
import { MagnifyingGlass } from "../../icons/MagnifyingGlass";
import { useCoreSdk } from "../../hooks/useCoreSdk";
import { InputField, InputWrapper } from "./SearchBar.styles";
import { BaseMetadataEntityFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";

interface SearchBarProps {
  placeholder?: string;
  disabled?: boolean;
  chainId?: number;
  onSuccess?: (results: BaseMetadataEntityFieldsFragment[]) => void;
  onError?: (error: Error) => void;
}

export const SearchBar = ({
  placeholder = "Search...",
  disabled = false,
  chainId = 1234,
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

        let searchResults: BaseMetadataEntityFieldsFragment[] = [];

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

        const [searchResultsDesc, searchResultsName, searchResultsId] =
          await Promise.all([
            searchResultsDescPromise,
            searchResultsNamePromise,
            searchResultsIdPromise
          ]);

        searchResults = [
          ...searchResultsDesc,
          ...searchResultsName,
          ...searchResultsId
        ];
        onSuccess?.(searchResults);
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
