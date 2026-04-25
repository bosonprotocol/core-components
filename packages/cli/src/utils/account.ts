type Seller = {
  id: string;
  assistant: string;
  admin: string;
  clerk: string;
  treasury: string;
  active: boolean;
  metadataUri: string;
};

type AuthToken = {
  tokenId: string;
  tokenType: number;
};

export type SellerData = {
  exists: boolean;
  seller: Seller;
  authToken: AuthToken;
};

function sellerFromStruct(struct: Array<unknown>): Seller {
  const [id, assistant, admin, clerk, treasury, active, metadataUri] =
    struct as [
      { toString(): string },
      string,
      string,
      string,
      string,
      boolean,
      string
    ];
  return {
    id: id.toString(),
    assistant,
    admin,
    clerk,
    treasury,
    active,
    metadataUri
  };
}

function authTokenFromStruct(struct: Array<unknown>): AuthToken {
  const [tokenId, tokenType] = struct as [{ toString(): string }, number];
  return {
    tokenId: tokenId.toString(),
    tokenType
  };
}

export function extractSellerData(sellerData: Array<unknown>): SellerData {
  const [exists, sellerStruct, authTokenStruct] = sellerData;
  const seller = sellerFromStruct(sellerStruct as unknown[]);
  const authToken = authTokenFromStruct(authTokenStruct as unknown[]);
  return {
    exists: exists as boolean,
    seller,
    authToken
  };
}
