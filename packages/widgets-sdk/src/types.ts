export type WidgetConfig = {
  widgetsUrl: string;
  chainId: number;
  protocolDiamond?: string;
  subgraphUrl?: string;
  jsonRpcUrl?: string;
  theGraphIpfsUrl?: string;
  ipfsMetadataUrl?: string;
  height?: number;
  width?: number;
};

export interface OptionalParams {
  forceBuyerView?: boolean;
}
