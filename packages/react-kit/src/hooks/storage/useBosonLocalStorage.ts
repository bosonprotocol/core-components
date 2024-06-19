import {
  getItemFromStorage as baseGetItemFromStorage,
  saveItemInStorage as baseSaveItemInStorage,
  removeItemInStorage as baseRemoveItemInStorage,
  clearLocalStorage as baseClearLocalStorage,
  useLocalStorage as useBaseLocalStorage
} from "./useLocalStorage";

export type GetItemFromStorageKey =
  | "wagmi.store"
  | "isChainUnsupported"
  | "tracing-url"
  | "isConnectWalletFromCommit"
  | "convertionRates"
  | "google-jwt"
  | "showCookies";

export function getItemFromStorage<T>(
  key: GetItemFromStorageKey,
  initialValue: T
) {
  return baseGetItemFromStorage(key, initialValue);
}

export function saveItemInStorage<T>(key: string, value: T) {
  return baseSaveItemInStorage(key, value);
}

export function removeItemInStorage(key: string) {
  return baseRemoveItemInStorage(key);
}

export const clearLocalStorage = baseClearLocalStorage;

export function useLocalStorage<T>(
  key: GetItemFromStorageKey,
  initialValue: T
) {
  return useBaseLocalStorage(key, initialValue);
}
