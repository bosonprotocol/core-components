import React from "react";
import {
  InnerDetailWithProviderCommit,
  InnerDetailWithProviderCommitProps
} from "./InnerDetailWithProviderCommit";
import {
  DetailViewWithProvider,
  DetailViewWithProviderProps
} from "./DetailViewWithProvider";

export type CommitDetailViewWithProviderProps =
  InnerDetailWithProviderCommitProps & DetailViewWithProviderProps;

export const CommitDetailViewWithProvider: React.FC<
  CommitDetailViewWithProviderProps
> = (props) => {
  return (
    <DetailViewWithProvider {...props}>
      <InnerDetailWithProviderCommit {...props} />
    </DetailViewWithProvider>
  );
};
