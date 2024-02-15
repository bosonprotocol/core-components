import { useAppSelector } from "../../state/hooks";
import { AppState } from "../../state/reducer";

export function useAllLists(): AppState["lists"]["byUrl"] {
  return useAppSelector((state) => state.lists.byUrl);
}
