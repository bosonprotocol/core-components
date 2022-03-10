export function sortObjKeys(
  objToSort: Record<string, unknown>
): Record<string, unknown> {
  return Object.keys(objToSort)
    .sort()
    .reduce<Record<string, unknown>>((obj, key) => {
      obj[key] = objToSort[key];
      return obj;
    }, {});
}
