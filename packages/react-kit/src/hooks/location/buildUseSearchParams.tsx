import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export type BuildUseSearchParamsProps = {
  useNavigate: () => (arg0: { pathname: string; search: string }) => unknown;
};
export function buildUseSearchParams({
  useNavigate
}: BuildUseSearchParamsProps) {
  return () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [params, setParams] = useState(qs.parse(location.search));

    const handleChange = useCallback(
      (name: string, value: string) => {
        const oldParams = qs.parse(location.search);

        const newParams = {
          ...oldParams,
          [name]: value
        };
        setParams(newParams);
      },
      [location.search]
    );

    useEffect(() => {
      navigate({
        pathname: location.pathname,
        search: qs.stringify(params)
      });
    }, [params]); // eslint-disable-line

    useEffect(() => {
      setParams(qs.parse(location.search));
    }, [location.search]); // eslint-disable-line

    return {
      params,
      handleChange
    };
  };
}
