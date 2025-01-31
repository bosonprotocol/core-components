const deliveryAddressVar =
  typeof process !== "undefined"
    ? process?.env?.REACT_APP_DELIVERY_ADDRESS_MOCK || // @ts-expect-error import.meta.env only exists in vite environments
      import.meta?.env?.REACT_APP_DELIVERY_ADDRESS_MOCK
    : // @ts-expect-error import.meta.env only exists in vite environments
      import.meta?.env?.REACT_APP_DELIVERY_ADDRESS_MOCK;
export const mockedDeliveryAddress = deliveryAddressVar
  ? JSON.parse(deliveryAddressVar)
  : undefined;
