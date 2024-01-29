export type Media = {
  url: string;
  tag?: string;
  type?: string;
  width?: number;
  height?: number;
  fit?: string;
  position?: string;
};

export function buildUuid(): string {
  if (typeof window !== "undefined" && window?.crypto) {
    return window.crypto.randomUUID();
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require("crypto");
    return crypto.randomUUID();
  }
}
