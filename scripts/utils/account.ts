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

function sellerFromStruct(struct: Array<any>): Seller {
  const [id, assistant, admin, clerk, treasury, active, metadataUri] = struct;
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

function authTokenFromStruct(struct: Array<any>): AuthToken {
  const [tokenId, tokenType] = struct;
  return {
    tokenId: tokenId.toString(),
    tokenType
  };
}

export function extractSellerData(sellerData: Array<unknown>): SellerData {
  const [exists, sellerStruct, authTokenStruct] = sellerData;
  const seller = sellerFromStruct(sellerStruct as any[]);
  const authToken = authTokenFromStruct(authTokenStruct as any[]);
  return {
    exists: exists as boolean,
    seller,
    authToken
  };
}
