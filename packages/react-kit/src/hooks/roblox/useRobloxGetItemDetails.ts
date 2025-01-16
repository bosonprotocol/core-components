import { useQuery } from "react-query";
import * as yup from "yup";
import { useRobloxConfigContext } from "./context/useRobloxConfigContext";

type UseRobloxGetItemDetailsProps = {
  itemId: string;
  options: {
    enabled?: boolean;
  };
};

const responseSchema = yup.object({
  name: yup.string().required()
});
type PayloadResponse = yup.InferType<typeof responseSchema>;
export const useRobloxGetItemDetails = ({
  itemId,
  options
}: UseRobloxGetItemDetailsProps) => {
  const { backendOrigin } = useRobloxConfigContext();
  const queryKey = ["roblox-item-details", itemId, backendOrigin];
  return useQuery(
    queryKey,
    async (): Promise<PayloadResponse> => {
      const response = await fetch(
        `${backendOrigin}/asset-details?assetId=${itemId}`
      );
      if (!response.ok) {
        const errorMessage = `Error while fetching /asset-details, status = ${response.status.toString()}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
      const jsonData = await response.json();
      const validatedData = await responseSchema.validate(jsonData);
      return validatedData;
    },
    options
  );
};
