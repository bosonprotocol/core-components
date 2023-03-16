// extracted from https://usehooks.com/useLocalStorage/
import { useCallback, useState } from "react";

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
  if (typeof window === "undefined") {
    return initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(error);
    return initialValue;
  }
}

export function saveItemInStorage<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }
}

export function removeItemInStorage(key: string) {
  if (typeof window !== "undefined") {
    try {
      Object.keys(localStorage)
        .filter((filterKey) => filterKey?.includes(key))
        .map((finalKey) => localStorage.removeItem(finalKey));
    } catch (error) {
      console.error(error);
    }
  }
}

export const clearLocalStorage = () => {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error(error);
    }
  }
};

export function useLocalStorage<T>(
  key: GetItemFromStorageKey,
  initialValue: T
) {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getItemFromStorage(key, initialValue)
  );

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        saveItemInStorage(key, valueToStore);
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );
  const removeFromStorage = useCallback(() => {
    removeItemInStorage(key);
    setStoredValue(initialValue);
  }, [initialValue, key]);
  return [storedValue, setValue, removeFromStorage] as const;
}
