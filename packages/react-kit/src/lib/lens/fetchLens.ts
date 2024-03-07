import { GraphQLError } from "graphql";
import request, { rawRequest, RequestDocument } from "graphql-request";
import { Headers } from "graphql-request/src/types.dom";

export async function fetchLens<T, V = Record<string, unknown>>(
  url: string,
  document: RequestDocument,
  variables?: V,
  headers?: Record<string, unknown>
): Promise<T | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data = await request<T, V>(url, document, variables, {
      ...headers,
      Accept: "application/json",
      "Content-Type": "application/json"
    });
    return data;
  } catch (error) {
    console.error(error);
  }
  return null;
}

export async function fetchRawLens<T, V = Record<string, unknown>>(
  url: string,
  query: string,
  variables?: V,
  headers?: Record<string, unknown>
): Promise<{
  data: T;
  extensions?: unknown;
  headers: Headers;
  errors?: GraphQLError[];
  status: number;
}> {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = await rawRequest<T, V>(url, query, variables, {
      ...headers,
      Accept: "application/json",
      "Content-Type": "application/json"
    });
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
