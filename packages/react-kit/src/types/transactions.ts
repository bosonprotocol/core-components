import { subgraph } from "@bosonprotocol/core-sdk";

export type EventLog = Omit<subgraph.BaseEventLogFieldsFragment, "account"> & {
  exchange?: {
    id: string;
    offer?: {
      id: string;
    };
  };
  dispute?: {
    id: string;
  };
  offer?: {
    id: string;
  };
};
