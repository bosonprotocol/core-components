export function getIpfsHeaders(
  infuraProjectId?: string,
  infuraProjectSecret?: string
) {
  if (!infuraProjectId && !infuraProjectSecret) {
    console.error("IpfsProjectId and IpfsProjectSecret must be defined");
    return {} as Headers;
  }

  return {
    authorization: `Basic ${Buffer.from(
      infuraProjectId + ":" + infuraProjectSecret
    ).toString("base64")}`
  };
}
