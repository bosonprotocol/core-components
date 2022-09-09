export type Config = {
  PORT: number;
  CHAIN_ID: number;
}

let config: Config;

export function getConfig(): Config {
  if (!config) {
    config = { PORT: 0, CHAIN_ID: 0 };
  } 
  return config;
}
