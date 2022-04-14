import { JSONValue, JSONValueKind } from "@graphprotocol/graph-ts";

export function convertToString(jsonValue: JSONValue | null): string {
  if (jsonValue !== null && jsonValue.kind === JSONValueKind.STRING) {
    return jsonValue.toString();
  }

  return "";
}

export function convertToArray(jsonValue: JSONValue | null): Array<JSONValue> {
  if (jsonValue !== null && jsonValue.kind === JSONValueKind.ARRAY) {
    return jsonValue.toArray();
  }

  return [];
}

export function convertToStringArray(
  jsonValue: JSONValue | null
): Array<string> {
  const array = convertToArray(jsonValue);
  const convertedArray: Array<string> = [];
  for (let i = 0; i < array.length; i++) {
    convertedArray.push(convertToString(array[i]));
  }
  return convertedArray;
}

export function convertToBoolean(jsonValue: JSONValue | null): boolean {
  if (jsonValue !== null && jsonValue.kind === JSONValueKind.BOOL) {
    return jsonValue.toBool();
  }

  return false;
}
