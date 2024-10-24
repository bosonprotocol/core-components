import { createContext } from "react";

export const RobloxContext = createContext<{ backendOrigin: string } | null>(
  null
);
