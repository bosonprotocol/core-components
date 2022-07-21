import React, { useState } from "react";
import { MagnifyingGlass } from "../../icons/MagnifyingGlass";
import { useCoreSdk } from "../../hooks/useCoreSdk";
import { InputField, InputWrapper } from "./SearchBar.styles";
import { BaseMetadataEntityFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";

interface SearchBarProps {
  placeholder?: string;
  disabled?: boolean;
  searchResults: BaseMetadataEntityFieldsFragment[];
  chainId?: number;
}

export const SearchBar = ({
  placeholder = "Search...",
  disabled = false,
  searchResults,
  chainId = 1234
}: SearchBarProps) => {
  const [value, setValue] = useState("");

  const coreSdk = useCoreSdk({ chainId });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("🚀 ~ file: SearchBar.tsx ~ line 19 ~ handleChange ~ e", e);
    setValue(e.target.value);
  };

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log(`search with =>${value}`);

      searchResults = await coreSdk.getBaseMetadataEntities({
        metadataFilter: {
          description_contains_nocase: value,
          name_contains_nocase: value
        }
      });
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
