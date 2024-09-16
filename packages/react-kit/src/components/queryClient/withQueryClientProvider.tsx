import React from "react";
import { QueryClientProviderCustom } from "./QueryClientProviderCustom";

export const withQueryClientProvider = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  // Define the props type for the wrapped component
  type Props = P;

  // Return a new component
  const WithQueryClientProvider: React.FC<Props> = (props) => {
    return (
      <QueryClientProviderCustom>
        <WrappedComponent {...props} />
      </QueryClientProviderCustom>
    );
  };

  // Set display name for debugging purposes
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  WithQueryClientProvider.displayName = `withQueryClientProviderCustom(${displayName})`;

  return WithQueryClientProvider;
};
