export const getEnvVar = (key: string): string | undefined => {
  // @ts-expect-error import.meta.env only exists in vite environments
  return process?.env?.[key] || import.meta?.env?.[key];
};
