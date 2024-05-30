import React, { ReactNode } from "react";
import { ListsUpdater, ListsUpdaterProps } from "./lists/updater";
import { MulticallUpdater } from "../lib/state/multicall";

export type UpdatersProps = ListsUpdaterProps & { children?: ReactNode };
export const Updaters = ({ children, ...rest }: UpdatersProps) => {
  return (
    <>
      <ListsUpdater {...rest} />
      <MulticallUpdater />
      {children}
    </>
  );
};
