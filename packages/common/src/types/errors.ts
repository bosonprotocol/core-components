import { ParamType } from "@ethersproject/abi";

export type ErrorFragment = {
  name: string;
  type: "error";
  inputs: Array<ParamType>;
};
