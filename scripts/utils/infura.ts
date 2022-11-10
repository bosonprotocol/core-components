export function buildInfuraHeaders(
  infuraOptions: string
): Record<string, string> {
  const [infuraProjectId, infuraProjectSecret] = infuraOptions.split("/");
  if (infuraProjectSecret) {
    return {
      authorization: `Basic ${Buffer.from(
        infuraProjectId + ":" + infuraProjectSecret
      ).toString("base64")}`
    };
  }
  return {
    authorization: `Basic ${Buffer.from(infuraProjectId).toString("base64")}`
  };
}
