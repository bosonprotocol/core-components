import React, { ReactNode } from "react";
import { ListsUpdater, ListsUpdaterProps } from "./lists/updater";
import { MulticallUpdater } from "../lib/state/multicall";

export type UpdatersProps = ListsUpdaterProps & {
  children?: ReactNode;
  withWeb3React: boolean;
};
export const Updaters = ({
  children,
  withWeb3React,
  ...rest
}: UpdatersProps) => {
  return (
    <>
      <ListsUpdater {...rest} />
      {withWeb3React && <MulticallUpdater />}
      {children}
    </>
  );
};
