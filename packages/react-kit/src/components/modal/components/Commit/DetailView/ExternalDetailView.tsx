import React from "react";
import {
  DetailViewWithProvider,
  DetailViewWithProviderProps
} from "./DetailViewWithProvider";
import {
  CommitWidgetProviders,
  CommitWidgetProvidersProps
} from "../../../../widgets/commit/CommitWidgetProviders";

export type ExternalDetailViewProps = DetailViewWithProviderProps & {
  providerProps: Omit<CommitWidgetProvidersProps, "children">;
};

export const ExternalDetailView: React.FC<ExternalDetailViewProps> = (
  props
) => {
  return (
    <CommitWidgetProviders {...props.providerProps}>
      <DetailViewWithProvider {...props}></DetailViewWithProvider>
    </CommitWidgetProviders>
  );
};
