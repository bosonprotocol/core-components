import { useState } from "react";

export function useReloadToken() {
  const [reloadToken, setReloadToken] = useState(0);
  const reload = () => setReloadToken((token) => token + 1);

  return { reloadToken, reload };
}
