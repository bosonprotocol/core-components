export const robloxLocalStorageKey = "roblox";

export const robloxQueryKeys = {
  loggedIn: (origin: string) => ["roblox-logged-in", origin],
  logout: (origin: string) => ["roblox-loggout", origin]
} as const;
