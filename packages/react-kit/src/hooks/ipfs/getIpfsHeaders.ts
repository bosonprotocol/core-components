export type GetIpfsHeadersOptions = {
  /**
   * Pinata JWT, sent as `Authorization: Bearer <jwt>`. Takes precedence over
   * the legacy Infura project id / secret pair.
   */
  ipfsJwt?: string;
  /**
   * @deprecated Infura's IPFS service is decommissioned. Use `ipfsJwt`.
   */
  ipfsProjectId?: string;
  /**
   * @deprecated Infura's IPFS service is decommissioned. Use `ipfsJwt`.
   */
  ipfsProjectSecret?: string;
};

/**
 * Build the `Authorization` header for the configured IPFS storage, or an empty
 * object when no credential is available.
 */
export function getIpfsHeaders({
  ipfsJwt,
  ipfsProjectId,
  ipfsProjectSecret
}: GetIpfsHeadersOptions = {}): Record<string, string> {
  if (ipfsJwt) {
    return {
      Authorization: `Bearer ${ipfsJwt}`
    };
  }

  if (!ipfsProjectId || !ipfsProjectSecret) {
    return {};
  }

  return {
    // Same spelling as the JWT branch above: this is a public export, so a
    // consumer reading `headers.Authorization` has to work for both pairs.
    Authorization: `Basic ${Buffer.from(
      ipfsProjectId + ":" + ipfsProjectSecret
    ).toString("base64")}`
  };
}
