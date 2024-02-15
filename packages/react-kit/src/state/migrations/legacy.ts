import { persistor } from "../../state";

import { initialState as initialListsState } from "../lists/reducer";

function tryParseOldState<T>(value: string | null, fallback: T): T {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    return fallback;
  }
}

/**
 * These functions handle all migrations that existed before we started tracking version numbers.
 */

export const legacyLocalStorageMigration = async () => {
  const oldLists = localStorage.getItem("redux_localstorage_simple_lists");

  const newLists = tryParseOldState(oldLists, initialListsState);

  const result = {
    lists: newLists,
    _persist: { version: 0, rehydrated: true }
  };

  await persistor.flush();

  localStorage.removeItem("redux_localstorage_simple_transactions");
  localStorage.removeItem("redux_localstorage_simple_user");
  localStorage.removeItem("redux_localstorage_simple_lists");
  localStorage.removeItem("redux_localstorage_simple_signatures");
  return result;
};
