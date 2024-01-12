import React from "react";
import {
  CommitWidgetProviders,
  CommitWidgetProvidersProps
} from "../../../../widgets/commit/CommitWidgetProviders";
import {
  CommitDetailViewWithProvider,
  CommitDetailViewWithProviderProps
} from "./CommitDetailViewWithProvider";

export type ExternalDetailViewProps = CommitDetailViewWithProviderProps & {
  providerProps: Omit<CommitWidgetProvidersProps, "children">;
};

export const ExternalDetailView: React.FC<ExternalDetailViewProps> = (
  props
) => {
  return (
    <CommitWidgetProviders {...props.providerProps}>
      <CommitDetailViewWithProvider {...props} />
    </CommitWidgetProviders>
  );
};
