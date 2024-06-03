import { combineReducers } from "@reduxjs/toolkit";
import localForage from "localforage";
import { PersistConfig, persistReducer } from "redux-persist";

import lists from "./lists/reducer";

import { customCreateMigrate, migrations } from "./migrations";
import user from "./user/reducer";
import wallets from "./wallets/reducer";
import multicall from "../lib/state/multicall";
const persistedReducers = {
  user,
  lists
};

const appReducer = combineReducers({
  wallets,
  multicall: multicall.reducer,
  ...persistedReducers
});

export type AppState = ReturnType<typeof appReducer>;

const persistConfig: PersistConfig<AppState> = {
  key: "CC",
  version: 0, // see migrations.ts for more details about this version
  storage: localForage.createInstance({
    name: "redux-cc"
  }),
  migrate: customCreateMigrate(migrations, { debug: false }),
  whitelist: Object.keys(persistedReducers),
  throttle: 1000, // ms
  serialize: false,
  // The typescript definitions are wrong - we need this to be false for unserialized storage to work.
  // We need unserialized storage for inspectable db entries for debugging.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  deserialize: false,
  debug: false // envName === "testing"
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export default persistedReducer;
