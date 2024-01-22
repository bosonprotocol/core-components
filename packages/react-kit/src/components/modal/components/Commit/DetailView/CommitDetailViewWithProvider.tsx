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
  InnerDetailWithProviderCommitProps &
    Omit<DetailViewWithProviderProps, "offer">;

export const CommitDetailViewWithProvider: React.FC<
  CommitDetailViewWithProviderProps
> = (props) => {
  return (
    <DetailViewWithProvider {...props} offer={props.selectedVariant.offer}>
      <InnerDetailWithProviderCommit {...props} />
    </DetailViewWithProvider>
  );
};
