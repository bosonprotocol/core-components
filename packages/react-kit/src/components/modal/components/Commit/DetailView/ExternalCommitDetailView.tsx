import React from "react";
import {
  CommitWidgetProviders,
  CommitWidgetProvidersProps
} from "../../../../widgets/commit/CommitWidgetProviders";
import {
  CommitDetailViewWithProvider,
  CommitDetailViewWithProviderProps
} from "./CommitDetailViewWithProvider";
import { ResetStylesForNonWidgets } from "../../../../styles/ResetStylesForNonWidgets";
export {
  CommitWidgetReduxProvider,
  CommitWidgetReduxUpdaters
} from "../../../../widgets/commit/CommitWidgetProviders";

export type ExternalCommitDetailViewProps =
  CommitDetailViewWithProviderProps & {
    providerProps: Omit<CommitWidgetProvidersProps, "children">;
  };
export const ExternalCommitDetailView: React.FC<
  ExternalCommitDetailViewProps
> = (props) => {
  return (
    <ResetStylesForNonWidgets>
      <CommitWidgetProviders {...props.providerProps}>
        <CommitDetailViewWithProvider {...props} />
      </CommitWidgetProviders>
    </ResetStylesForNonWidgets>
  );
};
