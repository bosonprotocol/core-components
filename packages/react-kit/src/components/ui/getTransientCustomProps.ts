export const getTransientCustomProps = <PropsWith$, PropsWithout$>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>,
  transientPropsSelection: Record<string, true>
) => {
  const transientProps: PropsWith$ = {} as PropsWith$;
  const otherProps: PropsWithout$ = {} as PropsWithout$;
  Object.entries(props).forEach(([key, value]) => {
    if (transientPropsSelection[key as keyof typeof transientPropsSelection]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      transientProps[`$${key}`] = value;
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      otherProps[key] = value;
    }
  });
  return {
    transientProps,
    otherProps
  };
};
