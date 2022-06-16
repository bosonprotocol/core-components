import { useState } from "react";

export function useReloadCounter() {
  const [reloadCounter, setReloadCounter] = useState(0);
  const reload = () => setReloadCounter((counter) => counter + 1);

  return { reloadCounter, reload };
}
