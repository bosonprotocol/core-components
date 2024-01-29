export const missingArguments = [
  {
    arg: "schemaUrl",
    data: { schemaUrl: undefined },
    error: /schemaUrl is a required field/
  },
  {
    arg: "type",
    data: { type: undefined },
    error: /Metadata validation failed for unknown type/
  },
  {
    arg: "name",
    data: { name: undefined },
    error: /name is a required field/
  }
];
