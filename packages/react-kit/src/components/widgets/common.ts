export const getParentWindowOrigin = () => {
  const parentOrigin = document.referrer
    ? new URL(document.referrer).origin
    : null;
  return parentOrigin;
};
