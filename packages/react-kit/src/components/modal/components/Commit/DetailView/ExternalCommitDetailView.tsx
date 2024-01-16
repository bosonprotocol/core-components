import React from "react";
import {
  CommitWidgetProviders,
  CommitWidgetProvidersProps
} from "../../../../widgets/commit/CommitWidgetProviders";
import {
  CommitDetailViewWithProvider,
  CommitDetailViewWithProviderProps
} from "./CommitDetailViewWithProvider";

export type ExternalCommitDetailViewProps =
  CommitDetailViewWithProviderProps & {
    providerProps: Omit<CommitWidgetProvidersProps, "children">;
  };

export const ExternalCommitDetailView: React.FC<
  ExternalCommitDetailViewProps
> = (props) => {
  return (
    <CommitWidgetProviders {...props.providerProps}>
      <CommitDetailViewWithProvider {...props} />
    </CommitWidgetProviders>
  );
};
