import * as Yup from "yup";

export const robloxLocalStorageKey = "roblox";

export const loggedInPayloadSchema = Yup.object({
  isLoggedIn: Yup.boolean().required(),
  claims: Yup.object({
    nickname: Yup.string().required()
  }).nullable()
});

export type RobloxLoggedIn = Yup.InferType<typeof loggedInPayloadSchema>;

export const robloxQueryKeys = {
  loggedIn: (origin: string) => ["roblox-logged-in", origin],
  logout: (origin: string) => ["roblox-loggout", origin]
} as const;