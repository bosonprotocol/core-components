import React, { ReactNode } from "react";
import { ListsUpdater } from "./lists/updater";

export const Updaters = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ListsUpdater />
      {children}
    </>
  );
};
