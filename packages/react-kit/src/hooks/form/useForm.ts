import { useFormikContext } from "formik";

export function useForm<T>() {
  const context = useFormikContext<T>();

  const nextIsDisabled = !context.isValid && context.submitCount > 0;

  return {
    ...context,
    nextIsDisabled
  };
}
