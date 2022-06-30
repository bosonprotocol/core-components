export function isAccountSeller(
  account: string,
  seller?: {
    clerk: string;
    admin: string;
    treasury: string;
    operator: string;
  }
) {
  if (!seller) {
    return false;
  }

  const sellerAddresses = [
    seller.admin,
    seller.clerk,
    seller.treasury,
    seller.operator
  ];
  return !!sellerAddresses.find(
    (address) => account.toLowerCase() === address.toLowerCase()
  );
}
