import { useQuery } from "react-query";
import * as yup from "yup";

type UseRobloxGetItemDetailsProps = {
  itemId: string;
  options: {
    enabled?: boolean;
  };
};

const responseSchema = yup.object({
  Name: yup.string().required()
});
type PayloadResponse = yup.InferType<typeof responseSchema>;
export const useRobloxGetItemDetails = ({
  itemId,
  options
}: UseRobloxGetItemDetailsProps) => {
  const queryKey = ["roblox-item-details", itemId];
  return useQuery(
    queryKey,
    async (): Promise<PayloadResponse> => {
      // TODO:
      // const endpoint = CONFIG.roblox.getItemDetailsEndpoint2({ itemId });
      // const response = await fetch(endpoint);
      // if (!response.ok) {
      //   console.error(
      //     `Error while fetching ${endpoint}, status = ${response.status.toString()}`
      //   );
      //   const endpoint2 = CONFIG.roblox.getItemDetailsEndpoint({ itemId });
      //   const response2 = await fetch(endpoint2);
      //   if (!response2.ok) {
      //     throw new Error(
      //       `Error while fetching ${endpoint2}, status = ${response2.status.toString()}`
      //     );
      //   }
      //   const jsonData = await response2.json();
      //   const validatedData = await responseSchema.validate(jsonData);
      //   return validatedData;
      // }
      // const jsonData = await response.json();
      // const validatedData = await responseSchema.validate(jsonData);
      // return validatedData;
      return {
        Name: "Name should be returned by the backend and not hardcoded"
      };
    },
    options
  );
};
