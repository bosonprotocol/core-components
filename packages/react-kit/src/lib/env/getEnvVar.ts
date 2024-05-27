export const getEnvVar = (key: string): string | undefined => {
  // @ts-expect-error import.meta.env only exists in vite environments
  return import.meta?.env?.[key] ?? process?.env?.[key];
};
