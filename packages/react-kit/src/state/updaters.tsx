import React, { ReactNode } from "react";
import { BlockNumberProvider } from "../hooks/uniswap/useBlockNumber";
import { MulticallUpdater } from "../lib/uniswap/state/multicall";
import { ApplicationUpdater } from "./application/updater";
import { ListsUpdater } from "./lists/updater";
import { apolloClient } from "../graphql/data/apollo";
import { ApolloProvider } from "@apollo/client";

function ReduxUpdaters() {
  return (
    <>
      {/* <RadialGradientByChainUpdater /> */}
      <ListsUpdater />
      {/* <SystemThemeUpdater /> */}
      <ApplicationUpdater />
      {/* <TransactionUpdater /> */}
      {/* <OrderUpdater /> */}
      <MulticallUpdater />
      {/* <LogsUpdater /> */}
    </>
  );
}
export const Updaters = ({ children }: { children: ReactNode }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <BlockNumberProvider>
        <ReduxUpdaters />
        {children}
      </BlockNumberProvider>
    </ApolloProvider>
  );
};
