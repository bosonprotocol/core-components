const MAX_AND_MIN_DATE_TIMESTAMP = 8.64e15; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

export const checkIfTimestampIsToo = (
  checkIf: "too_big" | "too_small",
  timestamp: number
) => {
  return checkIf === "too_big"
    ? timestamp > MAX_AND_MIN_DATE_TIMESTAMP
    : timestamp < MAX_AND_MIN_DATE_TIMESTAMP;
};
