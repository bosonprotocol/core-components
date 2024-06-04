export const ScrollToID = ({ id }: { id: string }) => {
  const localElement = document.getElementById(id);
  if (localElement) {
    localElement.scrollIntoView({ block: "center" });
  }
  return null;
};
