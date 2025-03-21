import { useEffect, useState } from "react";

/**
 * Returns the last value of type T that passes a filter function
 * @param value - changing value
 * @param filterFn - function that determines whether a given value should be considered for the last value
 */
export function useLast<T>(value: T, filterFn?: (value: T) => boolean): T {
  const [last, setLast] = useState<T>(value);
  useEffect(() => {
    setLast((last) => {
      const shouldUse: boolean = filterFn ? filterFn(value) : true;
      if (shouldUse) return value;
      return last;
    });
  }, [filterFn, value]);
  return last;
}
