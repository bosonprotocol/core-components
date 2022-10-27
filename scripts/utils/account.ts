type Seller = {
  id: string;
  operator: string;
  admin: string;
  clerk: string;
  treasury: string;
  active: boolean;
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
  const [id, operator, admin, clerk, treasury, active] = struct;
  return {
    id: id.toString(),
    operator,
    admin,
    clerk,
    treasury,
    active
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
