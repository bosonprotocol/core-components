import React from "react";
import {
  InnerDetailWithProviderCommit,
  InnerDetailWithProviderCommitProps
} from "./InnerDetailWithProviderCommit";
import {
  DetailViewWithProvider,
  DetailViewWithProviderProps
} from "../../common/detail/DetailViewWithProvider";

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
