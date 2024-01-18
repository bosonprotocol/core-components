import React from "react";
import {
  CommitWidgetProviders,
  CommitWidgetProvidersProps
} from "../../../../widgets/commit/CommitWidgetProviders";
import {
  CommitDetailViewWithProvider,
  CommitDetailViewWithProviderProps
} from "./CommitDetailViewWithProvider";
import GlobalStyle from "../../../../styles/GlobalStyle";

export type ExternalCommitDetailViewProps =
  CommitDetailViewWithProviderProps & {
    providerProps: Omit<CommitWidgetProvidersProps, "children">;
  };

export const ExternalCommitDetailView: React.FC<
  ExternalCommitDetailViewProps
> = (props) => {
  return (
    <CommitWidgetProviders {...props.providerProps}>
      <GlobalStyle />
      <CommitDetailViewWithProvider {...props} />
    </CommitWidgetProviders>
  );
};
