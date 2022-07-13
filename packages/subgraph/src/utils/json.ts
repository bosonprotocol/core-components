import { JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts";

export function convertToInt(jsonValue: JSONValue | null): i32 {
  if (jsonValue !== null && jsonValue.kind === JSONValueKind.NUMBER) {
    return jsonValue.toBigInt().toI32();
  }

  return 0;
}

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

export function convertToObject(
  jsonValue: JSONValue | null
): TypedMap<string, JSONValue> | null {
  if (jsonValue !== null && jsonValue.kind === JSONValueKind.OBJECT) {
    return jsonValue.toObject();
  }

  return null;
}

export function convertToObjectArray(
  jsonValue: JSONValue | null
): Array<TypedMap<string, JSONValue>> {
  const array = convertToArray(jsonValue);
  const convertedArray: Array<TypedMap<string, JSONValue>> = [];
  for (let i = 0; i < array.length; i++) {
    const convertedItem = convertToObject(array[i]);
    if (convertedItem) {
      convertedArray.push(convertedItem);
    }
  }
  return convertedArray;
}
