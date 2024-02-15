import { useQuery } from "react-query";
import { fetchLens } from "../../lib/lens/fetchLens";
import {
  ProfileQueryRequest,
  ProfilesDocument,
  ProfilesQuery
} from "../../lib/lens/generated";
import { useCoreSDKWithContext } from "../core-sdk/useCoreSdkWithContext";

type Params = Parameters<typeof getLensProfiles>[1];

type Props = Params;

export default function useGetLensProfiles(
  props: Props,
  options: {
    enabled?: boolean;
  }
) {
  const coreSDK = useCoreSDKWithContext();
  const { enabled } = options;
  return useQuery(
    ["get-lens-profiles", props],
    async () => {
      return getLensProfiles(coreSDK.lens?.apiLink || "", props);
    },
    {
      enabled
    }
  );
}

async function getLensProfiles(url: string, request: ProfileQueryRequest) {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (await fetchLens<ProfilesQuery>(url, ProfilesDocument, { request }))
      ?.profiles || { items: [], pageInfo: { totalCount: 0 } }
  );
}
