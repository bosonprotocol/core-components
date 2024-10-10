import * as Yup from "yup";

export const robloxLocalStorageKey = "roblox";

export const loggedInPayloadSchema = Yup.object({
  isLoggedIn: Yup.boolean().required(),
  claims: Yup.object({
    nickname: Yup.string().required()
  })
});

export type RobloxLoggedIn = Yup.InferType<typeof loggedInPayloadSchema>;

export const robloxQueryKeys = {
  loggedIn: "roblox-logged-in",
  logout: "roblox-logged-in"
} as const;
