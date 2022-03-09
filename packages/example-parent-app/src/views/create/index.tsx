import { createOffer } from "@bosonprotocol/widgets-sdk";

export function HomeView() {
  return (
    <div>
      <button
        onClick={() =>
          createOffer({
            ipfsCID: "1234",
            price: "1234",
            quantity: "1234"
          })
        }
      >
        createoffer
      </button>
    </div>
  );
}
