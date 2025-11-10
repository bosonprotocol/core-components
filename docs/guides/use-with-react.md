# Usage with `react`, `ethers` and `IPFS`

We provide an opinionated way to interact with the protocol, that requires `react`, `ethers` and `IPFS`.

## Install

In your existing react app, run

```bash
npm i @bosonprotocol/react-kit ethers
```

## Initialize

The most convenient way to initialize the `core-sdk` in a react environment, is to use the `useCoreSdk` hook

```ts
import { hooks } from "@bosonprotocol/react-kit";

// read-only
const readOnlyCoreSdk = hooks.useCoreSdk({
  envName: "testing",
  configId: "testing-80002-0"
});

// with write capabilities
const writeCoreSdk = hooks.useCoreSdk({
  envName: "testing",
  configId: "testing-80002-0",
  web3Provider: provider // ethers provider / signer
});
```

## Get Offers

```ts
import { hooks, withQueryClientProvider } from "@bosonprotocol/react-kit";

export const OffersTable = withQueryClientProvider(() => {
  const offers = hooks.useOffers(
    {
      envName: "testing",
      configId: "testing-80002-0"
    },
    {
      offersFirst: 10 // return the first 10 offers
    }
  );
  return (
    <table>
      <thead>
        <tr>
          <th>Offer ID</th>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {offers.data?.map((offer) => (
          <tr key={offer.id}>
            <td>{offer.id}</td>
            <td>{offer.metadata?.name}</td>
            <td>{offer.metadata?.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

```
