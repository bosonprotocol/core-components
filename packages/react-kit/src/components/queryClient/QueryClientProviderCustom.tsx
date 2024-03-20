import {
  QueryClient,
  QueryClientProvider,
  QueryClientProviderProps
} from "react-query";

import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

type QueryClientProviderCustomProps = Partial<QueryClientProviderProps>;

export const QueryClientProviderCustom: React.FC<
  QueryClientProviderCustomProps
> = ({ ...props }) => {
  return (
    <QueryClientProvider client={queryClient} {...props}>
      {props.children}
    </QueryClientProvider>
  );
};
